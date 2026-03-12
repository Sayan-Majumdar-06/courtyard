const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require("../models/User");
require("dotenv").config();

const supportedColleges = {
    'nitdgp.ac.in': 'NIT Durgapur',
    'iitkgp.ac.in': 'IIT Kharagpur',
    'ju.edu.in': 'Jadavpur University',
    'bits-pilani.ac.in': 'BITS Pilani',
    'iiit.ac.in': 'IIIT Hyderabad',
    'iiitd.ac.in': 'IIIT Delhi',
    'dtu.ac.in': 'Delhi Technological University',
    'nsut.ac.in': 'NSUT Delhi',

    // --- All IITs ---
    'iitb.ac.in': 'IIT Bombay',
    'iitd.ac.in': 'IIT Delhi',
    'iitk.ac.in': 'IIT Kanpur',
    'iitm.ac.in': 'IIT Madras',
    'iitr.ac.in': 'IIT Roorkee',
    'iitg.ac.in': 'IIT Guwahati',
    'iitbbs.ac.in': 'IIT Bhubaneswar',
    'iitgn.ac.in': 'IIT Gandhinagar',
    'iith.ac.in': 'IIT Hyderabad',
    'iiti.ac.in': 'IIT Indore',
    'iitj.ac.in': 'IIT Jodhpur',
    'iitp.ac.in': 'IIT Patna',
    'iitjammu.ac.in': 'IIT Jammu',
    'iitpkd.ac.in': 'IIT Palakkad',
    'iitgoa.ac.in': 'IIT Goa',
    'iitbhilai.ac.in': 'IIT Bhilai',
    'iitdh.ac.in': 'IIT Dharwad',
    'iitp.ac.in': 'IIT Patna',
    'iitbbs.ac.in': 'IIT Bhubaneswar',
    'iitrpr.ac.in': 'IIT Ropar',
    'iitdm.ac.in': 'IITDM Kurnool',
    'iitbhu.ac.in': 'IIT (BHU) Varanasi',
    'iitism.ac.in': 'IIT (ISM) Dhanbad',

    // --- All NITs ---
    'nitc.ac.in': 'NIT Calicut',
    'nitt.edu': 'NIT Trichy',
    'nitw.ac.in': 'NIT Warangal',
    'nitk.ac.in': 'NIT Surathkal',
    'mnit.ac.in': 'MNIT Jaipur',
    'vnit.ac.in': 'VNIT Nagpur',
    'nitrkl.ac.in': 'NIT Rourkela',
    'mnnit.ac.in': 'MNNIT Allahabad',
    'manit.ac.in': 'MANIT Bhopal',
    'nitjsr.ac.in': 'NIT Jamshedpur',
    'nitkurukshetra.ac.in': 'NIT Kurukshetra',
    'nits.ac.in': 'NIT Silchar',
    'nith.ac.in': 'NIT Hamirpur',
    'nitp.ac.in': 'NIT Patna',
    'nitrr.ac.in': 'NIT Raipur',
    'nitagartala.ac.in': 'NIT Agartala',
    'nitandhra.ac.in': 'NIT Andhra Pradesh',
    'nitap.ac.in': 'NIT Arunachal Pradesh',
    'nitdelhi.ac.in': 'NIT Delhi',
    'nitgoa.ac.in': 'NIT Goa',
    'nitmanipur.ac.in': 'NIT Manipur',
    'nitm.ac.in': 'NIT Meghalaya',
    'nitmz.ac.in': 'NIT Mizoram',
    'nitnagaland.ac.in': 'NIT Nagaland',
    'nitpy.ac.in': 'NIT Puducherry',
    'nitsikkim.ac.in': 'NIT Sikkim',
    'nitsri.ac.in': 'NIT Srinagar',
    'nituk.ac.in': 'NIT Uttarakhand',
    'svnit.ac.in': 'SVNIT Surat',
    'nitj.ac.in': 'NIT Jalandhar',
    'iiests.ac.in': 'IIEST Shibpur'
};

passport.use(
    new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
        proxy: true
    },
    
    async (asyncToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails[0].value;
            const ADMIN = 'sayanmajumdar.edu.3101@gmail.com';
            const domain = email.split('@')[1];

            const collegeName = supportedColleges[domain];

            if (email !== ADMIN && !collegeName) {
                return done(null, false, { message: "Campus not yet supported" });
            }

            let user = await User.findOne({ googleId: profile.id });

            if(!user) {
                let baseUsername = profile.displayName.replace(/\s+/g, '').toLowerCase();

                const existingUser = await User.findOne({ username: baseUsername });
                const finalUsername = existingUser 
                    ? `${baseUsername}${Math.floor(Math.random() * 1000)}` 
                    : baseUsername;

                user = await User.create({
                    googleId: profile.id,
                    username: finalUsername,
                    college: collegeName,
                    Name: profile.displayName,
                    email: profile.emails[0].value,
                    profilePic: '/images/default_avatar.png',
                });
            }

            done(null, user);
        } catch(err) {
            done(err, null);
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});