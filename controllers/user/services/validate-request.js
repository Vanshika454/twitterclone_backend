const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
};

const validateEditUser = (name, dob, location) => {
    let error = '';

    if (!name) error = 'Name should be valid!';
    if (!dob || !isValidDate(dob)) error = 'Date of Birth should be valid!';
    if (!location) error = 'Location should be valid!';

    if (error) throw new Error(error);
}

module.exports = {
    validateEditUser
}