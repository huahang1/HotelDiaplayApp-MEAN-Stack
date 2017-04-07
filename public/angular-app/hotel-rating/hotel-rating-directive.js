//when use component instead of directive, the restrict is by element
angular.module('meanhotel').component('hotelRating',{

    // = means access stars parameter by value
    bindings:{
        stars:'='
    },
    template:'<span ng-repeat="star in vm.stars track by $index" class="glyphicon glyphicon-star">{{star}}</span>',
    controller:'HotelController',
    controllerAs:'vm'
});