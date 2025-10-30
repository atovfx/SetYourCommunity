import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import prisma from './database';

const jwtOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: payload.id },
      });
      
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await prisma.user.findFirst({
            where: {
              oauthProvider: 'google',
              oauthId: profile.id,
            },
          });

          if (!user && profile.emails && profile.emails[0]) {
            user = await prisma.user.findUnique({
              where: { email: profile.emails[0].value },
            });

            if (user) {
              user = await prisma.user.update({
                where: { id: user.id },
                data: {
                  oauthProvider: 'google',
                  oauthId: profile.id,
                },
              });
            }
          }

          if (!user && profile.emails && profile.emails[0]) {
            user = await prisma.user.create({
              data: {
                email: profile.emails[0].value,
                name: profile.displayName || 'User',
                oauthProvider: 'google',
                oauthId: profile.id,
              },
            });
          }

          return done(null, user || false);
        } catch (error) {
          return done(error as Error, false);
        }
      }
    )
  );
}

export default passport;

