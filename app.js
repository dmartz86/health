(function () {
  window.angular.module('healthApp', [])
    .controller('PatientsController', ['$scope', '$http', '$timeout', PatientsController]);

  function PatientsController($scope, $http, $timeout) {
    var API = 'https://demo3417391.mockable.io/';
    var statuses = [];
    $scope.page = {
      size: 10, 
      current: 1,
      previous: 0,
      next: 0,
      count: 0
    };

    function init() {
      $http.get(API + 'patient_status')
        .then(assignStatus)
        .then(retrievePatients)
        .then(setPatients)
        .catch(console.error);
    }

    function assignStatus(res) {
      statuses = res.data.results;
    }
    
    function retrievePatients() {
      return $http.get(API + 'patients?page=' + $scope.page.current);
    }

    function setPatients(res) {
      $scope.page.count = res.data['count'];
      $scope.page.next = res.data['next_page'];
      $scope.page.previous = res.data['previous_page'];
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
    
    function passThePage(page) {
      if (!page) {return;}
      $scope.page.current = page;
      retrievePatients()
      .then(setPatients)
      .catch(console.error);
    }

    $scope.search = '';
    $scope.sort = 'id';
    $scope.inverse = false;
    $scope.patients = [];
    $scope.sortBy = sortBy;
    $scope.getStatus = getStatus;
    $scope.passThePage = passThePage;
    $timeout(init, 0);
  }
})();