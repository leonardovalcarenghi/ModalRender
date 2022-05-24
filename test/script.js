
var LoginModal = ImportModal('/user/login');

async function Login() {

    const response = await LoginModal.Open();
    console.log('retorno da modal de login', response);

}
















































// var LoginModal = ImportModal('/user/login');
// var ChangePasswordModal = ImportModal('/user/change-password');
// var InformartionsModal = ImportModal('/user/informations');





// async function ChangePassword() {

//     const response = await ChangePasswordModal.Open();

// }