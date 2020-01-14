module.exports = {
    signOptions : {
        issuer: 'It People corp',
        subject: 'People Corp',
        expiresIn: "12h",
        algorithm: "RS256" 
    },
    privatekey: '../certificates/private.key',
    publickey: '../certificates/public.key'
}