(function () {
  'use strict';

  describe('Userrequests Route Tests', function () {
    // Initialize global variables
    var $scope,
      UserrequestsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _UserrequestsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      UserrequestsService = _UserrequestsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('userrequests');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/userrequests');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          UserrequestsController,
          mockUserrequest;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('userrequests.view');
          $templateCache.put('modules/userrequests/client/views/view-userrequest.client.view.html', '');

          // create mock Userrequest
          mockUserrequest = new UserrequestsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Userrequest Name'
          });

          // Initialize Controller
          UserrequestsController = $controller('UserrequestsController as vm', {
            $scope: $scope,
            userrequestResolve: mockUserrequest
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:userrequestId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.userrequestResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            userrequestId: 1
          })).toEqual('/userrequests/1');
        }));

        it('should attach an Userrequest to the controller scope', function () {
          expect($scope.vm.userrequest._id).toBe(mockUserrequest._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/userrequests/client/views/view-userrequest.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          UserrequestsController,
          mockUserrequest;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('userrequests.create');
          $templateCache.put('modules/userrequests/client/views/form-userrequest.client.view.html', '');

          // create mock Userrequest
          mockUserrequest = new UserrequestsService();

          // Initialize Controller
          UserrequestsController = $controller('UserrequestsController as vm', {
            $scope: $scope,
            userrequestResolve: mockUserrequest
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.userrequestResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/userrequests/create');
        }));

        it('should attach an Userrequest to the controller scope', function () {
          expect($scope.vm.userrequest._id).toBe(mockUserrequest._id);
          expect($scope.vm.userrequest._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/userrequests/client/views/form-userrequest.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          UserrequestsController,
          mockUserrequest;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('userrequests.edit');
          $templateCache.put('modules/userrequests/client/views/form-userrequest.client.view.html', '');

          // create mock Userrequest
          mockUserrequest = new UserrequestsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Userrequest Name'
          });

          // Initialize Controller
          UserrequestsController = $controller('UserrequestsController as vm', {
            $scope: $scope,
            userrequestResolve: mockUserrequest
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:userrequestId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.userrequestResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            userrequestId: 1
          })).toEqual('/userrequests/1/edit');
        }));

        it('should attach an Userrequest to the controller scope', function () {
          expect($scope.vm.userrequest._id).toBe(mockUserrequest._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/userrequests/client/views/form-userrequest.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
