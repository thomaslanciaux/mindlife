var FormImageUploadController = [ '$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {

  $scope.selectedFiles = [];
  var $file = 0;

  $scope.onFileSelect = function($files, index) {
    $scope.uploadResult = [];
    $scope.selectedFile = index == 1 ? $files[0] : null;
    $scope.selectedFiles = index == 1 ? null : $files;
    for ( var i = 0; i < $files.length; i++) {

      $file = $files[i];
      $http.uploadFile({
        url : '//'+$scope.production_url_4LRest+'/_restAuth/upload',
        file : $file
      }).success(function(data, status, headers, config) {
        $scope.uploadResult.push(data.toString());
        $file_dir = headers().directory.toString();
        $file_name = headers().file_name.toString();
        // to fix IE not refreshing the model
        if (!$scope.$$phase) {
          $scope.$apply();
        }
        $http.post('//'+$scope.production_url_4LRest+'/_restFiles', 
          { 
            file_name: $scope.file.file_name,
            file_type: $file.type,
            file_lang: $scope.file.file_lang,
            file_size: $file.size,
            file_dir: $file_dir+'/'+$file_name,
            file_gallery_id: null,
            file_model: null
          }
        )
        .success(function(data, status) {
          
          if(data) {
            $scope.image_id = data.file_id;
            
          } else {
            
          }
        }).error(function(data, status) {
          
        });
      });
    }
  }

  $scope.delete_file = function(siteNav) {
  
    $http({ method: 'DELETE', url: '//'+$scope.production_url_4LRest+'/_restFiles/'+siteNav.file_banner_id
    })
    .success(function(data, status) {
      $http.put('//'+$scope.production_url_4LRest+'/_restNav/'+$routeParams.navID,
        { 
          id: $routeParams.navID,
          name: $scope.siteNav.name,
          target: $scope.siteNav.target,
          lang: $scope.siteNav.lang, 
          position: $scope.siteNav.position,
          file_banner_id: null
        }

      )
      .success(function(data, status) {
        if(data) {
          
          $http({ method: 'GET', url: '//'+$scope.production_url_4LRest+'/_restNav/'+$routeParams.navID, cache: false }).
            success(function(data, status) {
              $scope.siteNav = data[0];
            }).error(function(data, status) {
              
          });
          
        } else {
          
        }
      }).error(function(data, status) {
        
      });

    })
    .error(function(data, status) {
      
    }); 
  }
}];

var AuthenticationService = require('./services/authentication').initService();
var env = require('./env');

function getNav($http, cb) {
  var lang = env.getLang();
  var url = env.API.REST_URL + '/_restPublicNav/' + lang;
  var q = $http.get(url);
  q.then(function(res) {
    return cb(null, formatNav(res.data));
  });
}

function formatNav(raw) {
  var nav = [];
  for (var i = 0; i < raw.length; i++) {
    nav.push({
      label: raw[i].name,
      path: '/' + env.getLang() + '/' + raw[i].target,
      is_button: raw[i].is_button,
      icon_class: raw[i].icon_class,
      file_dir: raw[i].file_dir
    });
  }
  return nav;
}

function NavCtrl($rootScope, $scope, $http,  $window, $location, $document) {

  var url = $location.url();
  $segment = url.split('/');

  $rootScope.gallery_index = "10";

  $scope.production_url_4LRest = "mindlife.co.uk/AppWebRest";
  $scope.production_url_4LAdmin = "mindlife.co.uk/AppWebGenie";
  
  $url = 'http://localhost';
  if($rootScope.lang_loop != $segment[1])
  {
    $rootScope.lang = $segment[1];
    $rootScope.activeNav = $segment[2];

    $http({ method: 'GET', url: $url, cache: false}).
      success(function(data, status) {
        $rootScope.nav = data;

        for(var j = 0; j < len; j++){
            navigation.push({
              "path": '/'+$segment[1]+'/'+$scope.nav[j].target, 
              "label": $scope.nav[j].name,
              "is_button": $scope.nav[j].is_button,
              "icon_class": $scope.nav[j].icon_class,
              "file_dir": $scope.nav[j].file_dir
            });

            if('/'+$segment[1]+'/'+$scope.nav[j].target == $location.path())
            {
              $rootScope.bannerFileDir = $rootScope.nav[j].file_dir;
            }
          }

          if(AuthenticationService.isLoggedIn()) {
            navigation.push({
              "path": '/'+$segment[1]+'/dashboard', 
              "label": 'Dashboard',
              "is_button": 1,
              "icon_class": "",
              "file_dir": ""
            });

          }

          if(!AuthenticationService.isLoggedIn()) {
            
            navigation.push({
              "path": '/'+$segment[1]+'/signin', 
              "label": 'Sign In',
              "is_button": 1,
              "icon_class": "",
              "file_dir": ""
            });
          }

          if($rootScope.bannerFileDir == null) {
            //$rootScope.bannerFileDir = $rootScope.nav[0].file_dir;
          }
          
          $rootScope.navigation = navigation;
          
          $rootScope.navClass = function(navPath){
            var currentPath = $location.path();
            return ( currentPath === navPath ) ? 'active' : ''
          }

      }).
      error(function(data, status) { });
  }

  if($segment[3] !== null && $segment[2] == 'search') {

    $rootScope.bannerFileDir = null;
    
    $scope.newString = decodeURI($segment[3]);
    $scope.newString = $scope.newString.replace(/\s{2,}/g, ' ');
    $rootScope.searchString = $scope.newString;
    
    $scope.newString = $scope.newString.replace(/\s+/g, '|');
    $url = '//'+$scope.production_url_4LRest+'/_restPublicSearch/'+$scope.newString;
    $searchFormUrl = '//'+$scope.production_url_4LRest+'/_restPublicSearchForm/'+$scope.newString;
    
    $http({ method: 'GET', url: $searchFormUrl, cache: false }).
      success(function(data, status) 
      {
        $rootScope.searchFormResult = data;
        var len = $rootScope.searchFormResult.length;

        $rootScope.searchFormResultArray = [];
        $rootScope.searchFormResultAll = [];

        //$rootScope.searchFormResultArray.push();

        if ($rootScope.searchFormResult[0] != null)
        {

          var template_random_string = $rootScope.searchFormResult[0].template_random_string;
          
          for(var k = 0; k <= len; k++)
          {
            if($rootScope.searchFormResult[k] != null)
            {
              
              if(template_random_string == $rootScope.searchFormResult[k].template_random_string )
              {
                $rootScope.searchFormResultArray.push($rootScope.searchFormResult[k]);

              }
              else if(template_random_string != $rootScope.searchFormResult[k].template_random_string )
              {
                template_random_string = $rootScope.searchFormResult[k].template_random_string;
                $rootScope.searchFormResultAll.push($rootScope.searchFormResultArray);
                $rootScope.searchFormResultArray = null;
                $rootScope.searchFormResultArray = [];
                $rootScope.searchFormResultArray.push($rootScope.searchFormResult[k]);

              }
              
            }
            if( k == len)
            {
              $rootScope.searchFormResultAll.push($rootScope.searchFormResultArray);
              
            }
            
          }
        }

      });

    if ($rootScope.searchString == null) {
      $rootScope.searchString = decodeURI($segment[3]);
    }
  }
  else
  {
    $rootScope.searchFormResultArray = [];
    $rootScope.searchFormResultAll = [];

      $url = '//'+$scope.production_url_4LRest+'/_restPage/'+$segment[2];
      $rootScope.searchString = null;
    }

    $scope.submit_search = function(searchString) {

      $scope.newString = searchString.replace(/\s{2,}/g, ' ');
      $rootScope.searchString = $scope.newString;
    $scope.$safeApply(function() { $location.url("/"+$rootScope.lang+"/search/"+$scope.newString); });
    $rootScope.bannerFileDir = null;
  };
}

function PageCtrl($rootScope, $scope, $http, $document, $location, $sce) {

  $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  }

  $scope.animation = {};
  $scope.lol = 1;
  $scope.message = "<p class='gameStartMessage'>Start playing !</p>";

  $scope.lang = $segment[1];

  $scope.map = [];
  $scope.document_data = [];
  $scope.description_gallery = [{}];
  $scope.gallery = [{}];
  $scope.form_sent = 0;


  $scope.submit_form = function() {
    function randomString() {
      var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
      var string_length = 255;
      var randomstring = '';
      for (var i=0; i<string_length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum,rnum+1);
      }
      return randomstring;
    };
    
    $randomString = randomString();
    
    $scope.total_dim1 = 0;
    $scope.total_dim2 = 0;
    $scope.total_dim3 = 0;
    $scope.total_dim4 = 0;
    $scope.total_dim5 = 0;
    $scope.total_dim6 = 0;
    $scope.total_dim7 = 0;
    $scope.total_dim8 = 0;
    $scope.total_dim9 = 0;
    $scope.total_dim10 = 0;
    $scope.total_dim11 = 0;
    $scope.total_dim12 = 0;
    $scope.total_dim13 = 0;
    $scope.total_dim14 = 0;
    $scope.total_dim15 = 0;
    $scope.total_dim16 = 0;

    $scope.form_fields = $scope.mixed_fields;
    
    var len=$scope.mixed_fields.length;

    for(var i = 0; i < len; i++)
    {

      if($scope.form_fields[i].type == 'Checkboxes')
      {
        for (var j = 1; j <= 16; j++)
        {

          if($scope.selection.ids_select[[i]+j*10] == true)
          {

            var result = _.find($scope.template_form_fields.combos[i+1], function(obj) { return obj.id_select == [i]+j*10 });

            if($scope.form_fields[i].field_value != null)
            {

              $scope.form_fields[i].field_value = $scope.form_fields[i].field_value+', '+result.value;

              $scope.form_fields[i].dim1_field_score = $scope.form_fields[i].dim1_field_score + (result.combo_coef * $scope.form_fields[i].dimension_1_coef);
              $scope.form_fields[i].dim2_field_score = $scope.form_fields[i].dim2_field_score + (result.combo_coef * $scope.form_fields[i].dimension_2_coef);
              $scope.form_fields[i].dim3_field_score = $scope.form_fields[i].dim3_field_score + (result.combo_coef * $scope.form_fields[i].dimension_3_coef);
              $scope.form_fields[i].dim4_field_score = $scope.form_fields[i].dim4_field_score + (result.combo_coef * $scope.form_fields[i].dimension_4_coef);
              $scope.form_fields[i].dim5_field_score = $scope.form_fields[i].dim5_field_score + (result.combo_coef * $scope.form_fields[i].dimension_5_coef);
              $scope.form_fields[i].dim6_field_score = $scope.form_fields[i].dim6_field_score + (result.combo_coef * $scope.form_fields[i].dimension_6_coef);
              $scope.form_fields[i].dim7_field_score = $scope.form_fields[i].dim7_field_score + (result.combo_coef * $scope.form_fields[i].dimension_7_coef);
              $scope.form_fields[i].dim8_field_score = $scope.form_fields[i].dim8_field_score + (result.combo_coef * $scope.form_fields[i].dimension_8_coef);
              $scope.form_fields[i].dim9_field_score = $scope.form_fields[i].dim9_field_score + (result.combo_coef * $scope.form_fields[i].dimension_9_coef);
              $scope.form_fields[i].dim10_field_score = $scope.form_fields[i].dim10_field_score + (result.combo_coef * $scope.form_fields[i].dimension_10_coef);
              $scope.form_fields[i].dim11_field_score = $scope.form_fields[i].dim11_field_score + (result.combo_coef * $scope.form_fields[i].dimension_11_coef);
              $scope.form_fields[i].dim12_field_score = $scope.form_fields[i].dim12_field_score + (result.combo_coef * $scope.form_fields[i].dimension_12_coef);
              $scope.form_fields[i].dim13_field_score = $scope.form_fields[i].dim13_field_score + (result.combo_coef * $scope.form_fields[i].dimension_13_coef);
              $scope.form_fields[i].dim14_field_score = $scope.form_fields[i].dim14_field_score + (result.combo_coef * $scope.form_fields[i].dimension_14_coef);
              $scope.form_fields[i].dim15_field_score = $scope.form_fields[i].dim15_field_score + (result.combo_coef * $scope.form_fields[i].dimension_15_coef);
              $scope.form_fields[i].dim16_field_score = $scope.form_fields[i].dim16_field_score + (result.combo_coef * $scope.form_fields[i].dimension_16_coef);

            }
            else
            {
              $scope.form_fields[i].field_value = result.value;

              $scope.form_fields[i].dim1_field_score = result.combo_coef * $scope.form_fields[i].dimension_1_coef;
              $scope.form_fields[i].dim2_field_score = result.combo_coef * $scope.form_fields[i].dimension_2_coef;
              $scope.form_fields[i].dim3_field_score = result.combo_coef * $scope.form_fields[i].dimension_3_coef;
              $scope.form_fields[i].dim4_field_score = result.combo_coef * $scope.form_fields[i].dimension_4_coef;
              $scope.form_fields[i].dim5_field_score = result.combo_coef * $scope.form_fields[i].dimension_5_coef;
              $scope.form_fields[i].dim6_field_score = result.combo_coef * $scope.form_fields[i].dimension_6_coef;
              $scope.form_fields[i].dim7_field_score = result.combo_coef * $scope.form_fields[i].dimension_7_coef;
              $scope.form_fields[i].dim8_field_score = result.combo_coef * $scope.form_fields[i].dimension_8_coef;
              $scope.form_fields[i].dim9_field_score = result.combo_coef * $scope.form_fields[i].dimension_9_coef;
              $scope.form_fields[i].dim10_field_score = result.combo_coef * $scope.form_fields[i].dimension_10_coef;
              $scope.form_fields[i].dim11_field_score = result.combo_coef * $scope.form_fields[i].dimension_11_coef;
              $scope.form_fields[i].dim12_field_score = result.combo_coef * $scope.form_fields[i].dimension_12_coef;
              $scope.form_fields[i].dim13_field_score = result.combo_coef * $scope.form_fields[i].dimension_13_coef;
              $scope.form_fields[i].dim14_field_score = result.combo_coef * $scope.form_fields[i].dimension_14_coef;
              $scope.form_fields[i].dim15_field_score = result.combo_coef * $scope.form_fields[i].dimension_15_coef;
              $scope.form_fields[i].dim16_field_score = result.combo_coef * $scope.form_fields[i].dimension_16_coef;
            }

            //$scope.mixed_fields[0].combos[i+1].value
          }
          

          
        }
      }

      if($scope.form_fields[i].type == 'Radio')
      {
        
          var result = _.find($scope.template_form_fields.combos[i+1], function(obj) { return obj.value == $scope.form_fields[i].field_value });
            
          $scope.form_fields[i].dim1_field_score = result.combo_coef * $scope.form_fields[i].dimension_1_coef;
          $scope.form_fields[i].dim2_field_score = result.combo_coef * $scope.form_fields[i].dimension_2_coef;
          $scope.form_fields[i].dim3_field_score = result.combo_coef * $scope.form_fields[i].dimension_3_coef;
          $scope.form_fields[i].dim4_field_score = result.combo_coef * $scope.form_fields[i].dimension_4_coef;
          $scope.form_fields[i].dim5_field_score = result.combo_coef * $scope.form_fields[i].dimension_5_coef;
          $scope.form_fields[i].dim6_field_score = result.combo_coef * $scope.form_fields[i].dimension_6_coef;
          $scope.form_fields[i].dim7_field_score = result.combo_coef * $scope.form_fields[i].dimension_7_coef;
          $scope.form_fields[i].dim8_field_score = result.combo_coef * $scope.form_fields[i].dimension_8_coef;
          $scope.form_fields[i].dim9_field_score = result.combo_coef * $scope.form_fields[i].dimension_9_coef;
          $scope.form_fields[i].dim10_field_score = result.combo_coef * $scope.form_fields[i].dimension_10_coef;
          $scope.form_fields[i].dim11_field_score = result.combo_coef * $scope.form_fields[i].dimension_11_coef;
          $scope.form_fields[i].dim12_field_score = result.combo_coef * $scope.form_fields[i].dimension_12_coef;
          $scope.form_fields[i].dim13_field_score = result.combo_coef * $scope.form_fields[i].dimension_13_coef;
          $scope.form_fields[i].dim14_field_score = result.combo_coef * $scope.form_fields[i].dimension_14_coef;
          $scope.form_fields[i].dim15_field_score = result.combo_coef * $scope.form_fields[i].dimension_15_coef;
          $scope.form_fields[i].dim16_field_score = result.combo_coef * $scope.form_fields[i].dimension_16_coef;

      }

      if($scope.form_fields[i].type == 'Select')
      {
        
          var result = _.find($scope.template_form_fields.combos[i+1], function(obj) { return obj.value == $scope.form_fields[i].field_value });
            
          $scope.form_fields[i].dim1_field_score = result.combo_coef * $scope.form_fields[i].dimension_1_coef;
          $scope.form_fields[i].dim2_field_score = result.combo_coef * $scope.form_fields[i].dimension_2_coef;
          $scope.form_fields[i].dim3_field_score = result.combo_coef * $scope.form_fields[i].dimension_3_coef;
          $scope.form_fields[i].dim4_field_score = result.combo_coef * $scope.form_fields[i].dimension_4_coef;
          $scope.form_fields[i].dim5_field_score = result.combo_coef * $scope.form_fields[i].dimension_5_coef;
          $scope.form_fields[i].dim6_field_score = result.combo_coef * $scope.form_fields[i].dimension_6_coef;
          $scope.form_fields[i].dim7_field_score = result.combo_coef * $scope.form_fields[i].dimension_7_coef;
          $scope.form_fields[i].dim8_field_score = result.combo_coef * $scope.form_fields[i].dimension_8_coef;
          $scope.form_fields[i].dim9_field_score = result.combo_coef * $scope.form_fields[i].dimension_9_coef;
          $scope.form_fields[i].dim10_field_score = result.combo_coef * $scope.form_fields[i].dimension_10_coef;
          $scope.form_fields[i].dim11_field_score = result.combo_coef * $scope.form_fields[i].dimension_11_coef;
          $scope.form_fields[i].dim12_field_score = result.combo_coef * $scope.form_fields[i].dimension_12_coef;
          $scope.form_fields[i].dim13_field_score = result.combo_coef * $scope.form_fields[i].dimension_13_coef;
          $scope.form_fields[i].dim14_field_score = result.combo_coef * $scope.form_fields[i].dimension_14_coef;
          $scope.form_fields[i].dim15_field_score = result.combo_coef * $scope.form_fields[i].dimension_15_coef;
          $scope.form_fields[i].dim16_field_score = result.combo_coef * $scope.form_fields[i].dimension_16_coef;

      }

      if($scope.form_fields[i].type == 'Slider')
      {
        
          $scope.form_fields[i].dim1_field_score = $scope.form_fields[i].field_value * $scope.form_fields[i].dimension_1_coef;
          $scope.form_fields[i].dim2_field_score = $scope.form_fields[i].field_value * $scope.form_fields[i].dimension_2_coef;
          $scope.form_fields[i].dim3_field_score = $scope.form_fields[i].field_value * $scope.form_fields[i].dimension_3_coef;
          $scope.form_fields[i].dim4_field_score = $scope.form_fields[i].field_value * $scope.form_fields[i].dimension_4_coef;
          $scope.form_fields[i].dim5_field_score = $scope.form_fields[i].field_value * $scope.form_fields[i].dimension_5_coef;
          $scope.form_fields[i].dim6_field_score = $scope.form_fields[i].field_value * $scope.form_fields[i].dimension_6_coef;
          $scope.form_fields[i].dim7_field_score = $scope.form_fields[i].field_value * $scope.form_fields[i].dimension_7_coef;
          $scope.form_fields[i].dim8_field_score = $scope.form_fields[i].field_value * $scope.form_fields[i].dimension_8_coef;
          $scope.form_fields[i].dim9_field_score = $scope.form_fields[i].field_value * $scope.form_fields[i].dimension_9_coef;
          $scope.form_fields[i].dim10_field_score = $scope.form_fields[i].field_value * $scope.form_fields[i].dimension_10_coef;
          $scope.form_fields[i].dim11_field_score = $scope.form_fields[i].field_value * $scope.form_fields[i].dimension_11_coef;
          $scope.form_fields[i].dim12_field_score = $scope.form_fields[i].field_value * $scope.form_fields[i].dimension_12_coef;
          $scope.form_fields[i].dim13_field_score = $scope.form_fields[i].field_value * $scope.form_fields[i].dimension_13_coef;
          $scope.form_fields[i].dim14_field_score = $scope.form_fields[i].field_value * $scope.form_fields[i].dimension_14_coef;
          $scope.form_fields[i].dim15_field_score = $scope.form_fields[i].field_value * $scope.form_fields[i].dimension_15_coef;
          $scope.form_fields[i].dim16_field_score = $scope.form_fields[i].field_value * $scope.form_fields[i].dimension_16_coef;

      }

      if($rootScope.user.id != null)
      {
        var user_id = $rootScope.user.id;
        var printable_name = $rootScope.user.printable_name;
        var username = $rootScope.user.username;
      }
      else
      {
        var user_id = 0;
        var printable_name = "anonymous";
        var username = "The Anonymous";
      }
      
      $http.post('//'+$scope.production_url_4LRest+'/_restFormFields',
      {
        template_random_string: $randomString,
        template_id: $scope.form_fields[i].template_id,
        template_name: $scope.form_fields[i].template_name,
        template_description: $scope.form_fields[i].template_description,
        field_id: $scope.form_fields[i].field_id,
        field_label: $scope.form_fields[i].field_label,
        field_description: $scope.form_fields[i].field_description,   
        field_value: $scope.form_fields[i].field_value,
        field_type: $scope.form_fields[i].field_type,
        required: $scope.form_fields[i].required,         
        lang: $scope.form_fields[i].lang,
        position: i,
        searchable: $scope.form_fields[i].searchable,
        dim1_field_score: $scope.form_fields[i].dim1_field_score,
        dim2_field_score: $scope.form_fields[i].dim2_field_score,
        dim3_field_score: $scope.form_fields[i].dim3_field_score,
        dim4_field_score: $scope.form_fields[i].dim4_field_score,
        dim5_field_score: $scope.form_fields[i].dim5_field_score,
        dim6_field_score: $scope.form_fields[i].dim6_field_score,
        dim7_field_score: $scope.form_fields[i].dim7_field_score,
        dim8_field_score: $scope.form_fields[i].dim8_field_score,
        dim9_field_score: $scope.form_fields[i].dim9_field_score,
        dim10_field_score: $scope.form_fields[i].dim10_field_score,
        dim11_field_score: $scope.form_fields[i].dim11_field_score,
        dim12_field_score: $scope.form_fields[i].dim12_field_score,
        dim13_field_score: $scope.form_fields[i].dim13_field_score,
        dim14_field_score: $scope.form_fields[i].dim14_field_score,
        dim15_field_score: $scope.form_fields[i].dim15_field_score,
        dim16_field_score: $scope.form_fields[i].dim16_field_score,
        user_id: user_id,
        printable_name: printable_name,
        username: username
      })
      .success(function(data, status) {
        if(data) 
        {
          $scope.form_sent = 1;          
        }
      }).error(function(data, status) {
        
      });

      $scope.total_dim1 = $scope.total_dim1 + $scope.form_fields[i].dim1_field_score;
      $scope.total_dim2 = $scope.total_dim2 + $scope.form_fields[i].dim2_field_score;
      $scope.total_dim3 = $scope.total_dim3 + $scope.form_fields[i].dim3_field_score;
      $scope.total_dim4 = $scope.total_dim4 + $scope.form_fields[i].dim4_field_score;
      $scope.total_dim5 = $scope.total_dim5 + $scope.form_fields[i].dim5_field_score;
      $scope.total_dim6 = $scope.total_dim6 + $scope.form_fields[i].dim6_field_score;
      $scope.total_dim7 = $scope.total_dim7 + $scope.form_fields[i].dim7_field_score;
      $scope.total_dim8 = $scope.total_dim8 + $scope.form_fields[i].dim8_field_score;
      $scope.total_dim9 = $scope.total_dim9 + $scope.form_fields[i].dim9_field_score;
      $scope.total_dim10 = $scope.total_dim10 + $scope.form_fields[i].dim10_field_score;
      $scope.total_dim11 = $scope.total_dim11 + $scope.form_fields[i].dim11_field_score;
      $scope.total_dim12 = $scope.total_dim12 + $scope.form_fields[i].dim12_field_score;
      $scope.total_dim13 = $scope.total_dim13 + $scope.form_fields[i].dim13_field_score;
      $scope.total_dim14 = $scope.total_dim14 + $scope.form_fields[i].dim14_field_score;
      $scope.total_dim15 = $scope.total_dim15 + $scope.form_fields[i].dim15_field_score;
      $scope.total_dim16 = $scope.total_dim16 + $scope.form_fields[i].dim16_field_score;

    }

  };

  $http({ method: 'GET', url: $url, cache: false }).
    success(function(data, status) 
    {
      $scope.anchors = data;
      
      var len = $scope.anchors.length;
      $rootScope.numberAnchors = len;

      $rootScope.audioAnchorsCounter = null;
      $rootScope.fileAnchorsCounter = null;
      $rootScope.galleryAnchorsCounter = null;
      $rootScope.videoAnchorsCounter = null;
      $rootScope.otherAnchorsCounter = null;
      $rootScope.formAnchorsCounter = null;
      $rootScope.questionnaireAnchorsCounter = null;
      $rootScope.googleMapsAnchorsCounter = null;
      $rootScope.quoteAnchorsCounter = null;
      $rootScope.textAnchorsCounter = null;
      $rootScope.otherAnchorsCounter = null;


      for(var i = 0; i < len; i++)
      {


        if($scope.anchors[i].type == 'Audio')
        {
          $rootScope.audioAnchorsCounter = $rootScope.audioAnchorsCounter +1;
        }
        else if($scope.anchors[i].type == 'Video' || $scope.anchors[i].type == 'YoutubeVideo')
        {
          $rootScope.videoAnchorsCounter = $rootScope.videoAnchorsCounter +1;
        }
        else if($scope.anchors[i].type == 'File')
        {
          $rootScope.fileAnchorsCounter = $rootScope.fileAnchorsCounter +1;
        }
        else if($scope.anchors[i].type == 'Gallery')
        {
          $rootScope.galleryAnchorsCounter = $rootScope.galleryAnchorsCounter +1;
        }
        else if($scope.anchors[i].type == 'Form')
        {
          $rootScope.formAnchorsCounter = $rootScope.formAnchorsCounter +1;
        }
        else if($scope.anchors[i].type == 'Questionnaire')
        {
          $rootScope.questionnaireAnchorsCounter = $rootScope.questionnaireAnchorsCounter +1;
        }
        else if($scope.anchors[i].type == 'GoogleMaps')
        {
          $rootScope.googleMapsAnchorsCounter = $rootScope.googleMapsAnchorsCounter +1;
        }
        else if($scope.anchors[i].type == 'Quote')
        {
          $rootScope.quoteAnchorsCounter = $rootScope.quoteAnchorsCounter +1;
        }
        else if($scope.anchors[i].type == 'DescriptionOnly')
        {
          $rootScope.textAnchorsCounter = $rootScope.textAnchorsCounter +1;
        }
        else if($scope.anchors[i].type == 'Game')
        {
          $rootScope.quoteAnchorsCounter = $rootScope.quoteAnchorsCounter +1;
        }
        else
          $rootScope.otherAnchorsCounter = $rootScope.otherAnchorsCounter+1;


        if($scope.anchors[i].map_latlng)
        {
          $scope.map.push({
            sensor: false,
            size: '1200x300',
            zoom: $scope.anchors[i].map_zoom,
            center: $scope.anchors[i].map_latlng,
          markers: "["+$scope.anchors[i].map_marker+"]",
            maptype: 'roadmap',
            mapevents: {redirect: false, loadmap: true},
            listen: true});

          }
          else
            $scope.map.push({});


          if($scope.anchors[i].description_gallery_id)
          {
            $url_description_gallery = '//'+$scope.production_url_4LRest+'/_restGalleries/'+$scope.anchors[i].description_gallery_id;
            //$url_description_gallery = '//'+$scope.production_url_4LRest+'/_restGalleries/'+$scope.anchors[i].description_gallery_id;

            $http({ method: 'GET', url: $url_description_gallery, cache: false }).
            success(function(data, status) 
            {
              $scope.description_gallery[data[0].file_gallery_id] = data;
              
            }           
          ).
          error(function(data, status) {
            
          });

          }

          
          if($scope.anchors[i].gallery_id)
          {
            $url_gallery = '//'+$scope.production_url_4LRest+'/_restGalleries/'+$scope.anchors[i].gallery_id;
            //$url_gallery = '//'+$scope.production_url_4LRest+'/_restGalleries/'+$scope.anchors[i].gallery_id;

            $http({ method: 'GET', url: $url_gallery, cache: false }).
            success(function(data, status) 
            {
              $scope.gallery[data[0].file_gallery_id] = data;
              
            }           
          ).
          error(function(data, status) {
            
          });

          }

          if($scope.anchors[i].form_template_id)
          {
            $scope.step = 1;

            $url_template_fields = '//'+$scope.production_url_4LRest+'/_restTemplateFields/'+$scope.anchors[i].form_template_id;
            //$url_gallery = '//'+$scope.production_url_4LRest+'/_restTemplateFields/'+$scope.anchors[i].form_template_id;

            $http({ method: 'GET', url: $url_template_fields, cache: false }).
            success(function(data, status) 
            {
              $scope.template_form_fields = data;
              var combos = [[]];
              var mixed_fields = [[]];
              
              // Find the projectId in Projects and set the currentProject
              var len=$scope.template_form_fields.length;
              $scope.questLength = len;
              for(var i = 0; i < len; i++){
                
                if($scope.template_form_fields[i].type === 'Radio')
                {
                  $pre_field_value = $scope.template_form_fields[i].option1;
                  
                }
                else
                {
                  $pre_field_value = $scope.template_form_fields[i].field_value;
                }

                if($scope.template_form_fields[i].type === 'Checkboxes')
                {
                  $scope.selection = {
                        ids_select: {}
                    };
                }
                else
                {
                  $pre_field_value = $scope.template_form_fields[i].field_value;
                }
                if($scope.template_form_fields[i].type === 'Slider')
                {
                  $pre_field_value = $scope.template_form_fields[i].option1;
                  
                }
                      
                combos.push([
                    {"id_select": [i]+10, "value": $scope.template_form_fields[i].option1, "description": "Some description", "combo_coef": $scope.template_form_fields[i].combo_1_coef},
                    {"id_select": [i]+20, "value": $scope.template_form_fields[i].option2, "description": "Some description", "combo_coef": $scope.template_form_fields[i].combo_2_coef},
                    {"id_select": [i]+30, "value": $scope.template_form_fields[i].option3, "description": "Some description", "combo_coef": $scope.template_form_fields[i].combo_3_coef},
                    {"id_select": [i]+40, "value": $scope.template_form_fields[i].option4, "description": "Some description", "combo_coef": $scope.template_form_fields[i].combo_4_coef},
                  {"id_select": [i]+50, "value": $scope.template_form_fields[i].option5, "description": "Some description", "combo_coef": $scope.template_form_fields[i].combo_5_coef},
                  {"id_select": [i]+60, "value": $scope.template_form_fields[i].option6, "description": "Some description", "combo_coef": $scope.template_form_fields[i].combo_6_coef},
                  {"id_select": [i]+70, "value": $scope.template_form_fields[i].option7, "description": "Some description", "combo_coef": $scope.template_form_fields[i].combo_7_coef},
                  {"id_select": [i]+80, "value": $scope.template_form_fields[i].option8, "description": "Some description", "combo_coef": $scope.template_form_fields[i].combo_8_coef},
                  {"id_select": [i]+90, "value": $scope.template_form_fields[i].option9, "description": "Some description", "combo_coef": $scope.template_form_fields[i].combo_9_coef},
                  {"id_select": [i]+100, "value": $scope.template_form_fields[i].option10, "description": "Some description", "combo_coef": $scope.template_form_fields[i].combo_10_coef},
                  {"id_select": [i]+110, "value": $scope.template_form_fields[i].option11, "description": "Some description", "combo_coef": $scope.template_form_fields[i].combo_11_coef},
                  {"id_select": [i]+120, "value": $scope.template_form_fields[i].option12, "description": "Some description", "combo_coef": $scope.template_form_fields[i].combo_12_coef},
                  {"id_select": [i]+130, "value": $scope.template_form_fields[i].option13, "description": "Some description", "combo_coef": $scope.template_form_fields[i].combo_13_coef},
                  {"id_select": [i]+140, "value": $scope.template_form_fields[i].option14, "description": "Some description", "combo_coef": $scope.template_form_fields[i].combo_14_coef},
                  {"id_select": [i]+150, "value": $scope.template_form_fields[i].option15, "description": "Some description", "combo_coef": $scope.template_form_fields[i].combo_15_coef},
                  {"id_select": [i]+160, "value": $scope.template_form_fields[i].option16, "description": "Some description", "combo_coef": $scope.template_form_fields[i].combo_16_coef}]
                );

                $slider_init = $scope.template_form_fields[i].slider_ceiling / 2;
                  
                mixed_fields[0].push({
                  "template_id": $scope.template_form_fields[i].template_id,
                  "template_name": $scope.template_form_fields[i].template_name,
                  "template_description": $scope.template_form_fields[i].template_description,
                  "button_label": $scope.template_form_fields[i].button_label,
                  "field_id": $scope.template_form_fields[i].field_id,
                  "field_type": $scope.template_form_fields[i].type,
                  "field_label": $scope.template_form_fields[i].field_label,
                  "field_description": $scope.template_form_fields[i].field_description,
                  "position": $scope.template_form_fields[i].position,
                  "searchable": $scope.template_form_fields[i].searchable,
                  "field_value": $pre_field_value,
                  "type": $scope.template_form_fields[i].type,
                  "slider_floor": $scope.template_form_fields[i].slider_floor,
                  "slider_ceiling": $scope.template_form_fields[i].slider_ceiling,
                  "slider_step": $scope.template_form_fields[i].slider_step,
                  "slider_precision": $scope.template_form_fields[i].slider_precision,
                  "slider_floor_label": $scope.template_form_fields[i].slider_floor_label,
                  "slider_ceiling_label": $scope.template_form_fields[i].slider_ceiling_label,
                  "slider_init": $slider_init,
                  "lang": $scope.template_form_fields[i].lang,
                  "required": $scope.template_form_fields[i].required,
                  "dimension_1_coef": $scope.template_form_fields[i].dimension_1_coef,
                  "dimension_2_coef": $scope.template_form_fields[i].dimension_2_coef,
                  "dimension_3_coef": $scope.template_form_fields[i].dimension_3_coef,
                  "dimension_4_coef": $scope.template_form_fields[i].dimension_4_coef,
                  "dimension_5_coef": $scope.template_form_fields[i].dimension_5_coef,
                  "dimension_6_coef": $scope.template_form_fields[i].dimension_6_coef,
                  "dimension_7_coef": $scope.template_form_fields[i].dimension_7_coef,
                  "dimension_8_coef": $scope.template_form_fields[i].dimension_8_coef,
                  "dimension_9_coef": $scope.template_form_fields[i].dimension_9_coef,
                  "dimension_10_coef": $scope.template_form_fields[i].dimension_10_coef,
                  "dimension_11_coef": $scope.template_form_fields[i].dimension_11_coef,
                  "dimension_12_coef": $scope.template_form_fields[i].dimension_12_coef,
                  "dimension_13_coef": $scope.template_form_fields[i].dimension_13_coef,
                  "dimension_14_coef": $scope.template_form_fields[i].dimension_14_coef,
                  "dimension_15_coef": $scope.template_form_fields[i].dimension_15_coef,
                  "dimension_16_coef": $scope.template_form_fields[i].dimension_16_coef,
                  "combos":combos[i+1]
                });         
              }
              
              $scope.template_form_fields.combos = combos;
              $scope.mixed_fields = mixed_fields[0];
              
            }           
          ).
          error(function(data, status) {
            
          });
          }
      }
    }).
    error(function(data, status) {
      
    });

}

function CollapseCtrl($scope) {
  $scope.isCollapsed = true
}

(function() {

  "use strict";
  var module = angular.module("angular-memory-game-example", ["memory-game"]);

}());

function GameCtrl($scope) {

  $scope.tilesSrc = ['fa-heart', 'fa-comments-o', 'fa-smile-o', 'fa-pencil', 'fa-book' ,'fa-camera-retro'];

  // Listeners for events triggered by angular-memory-game
  $scope.$on("memoryGameUnmatchedPairEvent", function() {
    $scope.message = "<p class='gameFailMessage'>Try again!</p>";
  });
  $scope.$on("memoryGameMatchedPairEvent", function() {
    $scope.message = "<p class='gameSuccessMessage'>Good Match!</p>";
  });
  $scope.$on("memoryGameCompletedEvent", function() {
    $scope.message = "<p class='gameFinishMessage'>You did it!</p>";
  });

}

module.exports = {
  getNav: getNav,
  NavCtrl: NavCtrl
};
