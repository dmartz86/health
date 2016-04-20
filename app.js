(function () {
  window.angular.module('healthApp', [])
    .controller('PatientsController', ['$scope', '$http', '$timeout', PatientsController]);

  function PatientsController($scope, $http, $timeout) {
    var API = 'https://demo3417391.mockable.io/';
    var statuses = [];

    function init() {
      $http.get(API + 'patient_status')
        .then(assignStatus)
        .then(function () {
          return $http.get(API + 'patients');
        })
        .then(setPatients)
        .catch(console.error);
    }

    function assignStatus(res) {
      statuses = res.data.results;
    }

    function setPatients(res) {
      $scope.patients = res.data.results.map(function (p) {
        var fullName = p.name.split(' ');
        p.fname = fullName[0];
        p.lname = fullName[1];
        return p;
      });
    }

    function getStatus(patient) {
      var found = statuses.filter(function (status) {
        return status.patient === patient;
      });
      if (!found.length) { return ''; }
      return found[0].status
    }
    
    function sortBy(key) {
      if ($scope.sort === key) {
        $scope.inverse = !$scope.inverse;
      } else {
        $scope.sort = key;
      }
    }

    $scope.search = '';
    $scope.sort = 'id';
    
    $scope.inverse = false;
    $scope.patients = [];
    $scope.sortBy = sortBy;
    $scope.getStatus = getStatus;
    $timeout(init, 0);
  }
})();