'use strict';

angular.module('WorkoutBuilder')
  .controller('WorkoutListController', ['$scope', 'WorkoutService', '$location', function ($scope, WorkoutService, $location) {
      $scope.goto = function (workout) {
          $location.path('/builder/workouts/' + workout.name);
      }
      var init = function () {
          $scope.workouts = WorkoutService.getWorkouts();
      };
      init();
  }]);

angular.module('WorkoutBuilder')
  .controller('WorkoutDetailController', ['$scope', 'WorkoutBuilderService', 'selectedWorkout', '$location', function ($scope, WorkoutBuilderService, selectedWorkout, $location) {
      $scope.removeExercise = function (exercise) {
          WorkoutBuilderService.removeExercise(exercise);
      };

      $scope.$watch('formWorkout.exerciseCount', function (newValue) {
          if (newValue) {
              newValue.$setValidity("count", $scope.workout.exercises.length > 0);
          }
      });

      $scope.$watch('workout.exercises.length', function (newValue, oldValue) {
          if (newValue != oldValue) {
              $scope.formWorkout.exerciseCount.$dirty = true;
              $scope.formWorkout.$setDirty();
              $scope.formWorkout.exerciseCount.$setValidity("count", newValue > 0);
          }
      });

      //var restWatch = $scope.$watch('formWorkout.restBetweenExercise', function (newValue) {
      //    // Conversion logic courtesy http://stackoverflow.com/questions/596467/how-do-i-convert-a-number-to-an-integer-in-javascript
      //    if (newValue) {
      //        newValue.$parsers.unshift(function (value) {
      //            return isNaN(parseInt(value)) ? value : parseInt(value);
      //        });
      //        newValue.$formatters.push(function (value) {
      //            return isNaN(parseInt(value)) ? value : parseInt(value);
      //        });
      //        restWatch(); //De-register the watch.
      //    }
      //});

      $scope.moveExerciseTo = function (exercise, location) {
          WorkoutBuilderService.moveExerciseTo(exercise, location);
      };

      var init = function () {
          $scope.workout = selectedWorkout;
      };
      init();
  }]);