const isEmailValid = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
}

const validateRegister = (name, userName, email, password) => {
    let error = '';
    const passwordLength = 8;

    if (!name) error = 'Name should be valid!';
    if (!userName) error = 'userName should be valid!';
    if (!isEmailValid(email)) error = 'Email should be valid!';
    if (!password || password.length < passwordLength) error = 'password should contain minimum of 8 characters!';

    if (error) throw new Error(error);
}

const validateLogIn = (userName, password) => {
    let error = '';
    const passwordLength = 8;

    if (!userName) error = 'userName should be valid!';
    if (!password || password.length < passwordLength) error = 'password should contain minimum of 8 characters!';

    if (error) throw new Error(error);
}

module.exports = {
    validateRegister,
    validateLogIn
}
