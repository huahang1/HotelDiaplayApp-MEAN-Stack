angular.module('meanhotel').controller('RegisterController',RegisterController);

function RegisterController($http) {
    var vm = this;

    vm.register = function () {
        var user = {
            username: vm.username,
            password: vm.password
        };

        if (!vm.username || !vm.password) {
            vm.error = 'Please add a username and a password';
        } else {
            if (vm.password !== vm.passwordRepeat) {
                vm.error = 'Please make sure the passwords match';
            } else {
                $http.post('/api/users/register', user).then(function (result) {
                    console.log('register result: ', result);
                    vm.message = 'Success registration, please login';
                    vm.error = '';
                }).catch(function (error) {
                    console.log('error in registration: ', error);
                });
            }
        }
    }
}