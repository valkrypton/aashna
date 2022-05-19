export const checkEmailValidity = ( email)=> {
    return email.slice(email.length - 20, email.length)
        === "@student.nust.edu.pk" && email.length > 20;
}

export const checkPwValidity= (pass)=> {
    const pwRegex = new RegExp("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$");
    return pwRegex.test(pass);
}

