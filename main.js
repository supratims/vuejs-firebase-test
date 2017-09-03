var emailRE = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

// Setup Firebase
var config = {
  apiKey: "AIzaSyC5nbbPh-U8FtQZtXnRZe--N0yyDXi7yCE",
  authDomain: "vuetest-5c4d6.firebaseapp.com",
  databaseURL: "https://vuetest-5c4d6.firebaseio.com",
  projectId: "vuetest-5c4d6",
  storageBucket: "vuetest-5c4d6.appspot.com",
  messagingSenderId: "58323961621"
};
firebase.initializeApp(config);

// create Vue app
var app = new Vue({
  // element to mount to
  el: '#container',
  // initial data
  data: {
    newUser: {
      email: '',
      password: ''
    },
    user: {
        email: '',
        password: ''
    },
    error: {
        email: '',
        password: ''
    },
    message: {
        result: ''
    },
    registerSeen: true,
    loginSeen: false,
    alertSeen: true,
    profileSeen: false
  },
  computed: {
    alertSeen: function () {
        return this.message.result!=='';
    }
  },
  // computed property for form validation state
  computed: {
    validation: function () {
      return {
        email: emailRE.test(this.newUser.email),
        password: !!this.newUser.password.trim(),
      }
    },
    isValid: function () {
      var validation = this.validation
      var errors = this.error;
      return Object.keys(validation).every(function (key) {
        if (!validation[key]){
            errors[key] = 'Invalid '+key;
        }
        else {
            errors[key] = '';
        }
        return validation[key]
      })
    }
  },
  // methods
  methods: {
    resetForm: function(){
        this.newUser.email='';
        this.newUser.password = '';
        this.registerSeen = false;
        this.loginSeen = true;
    },
    showProfile: function(){
        this.loginSeen = false;
        this.profileSeen = true;
    },
    addUser: function () {
        var errors = this.error;
        var message = this.message;
        var resetForm = this.resetForm;
        if (this.isValid) {
            message.result = 'Adding ...';
            firebase.auth().createUserWithEmailAndPassword(this.newUser.email, this.newUser.password)
            .then(function(repsonse){
                message.result = 'Successfully registered ...';
                resetForm();
            })
            .catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              message.result = errorMessage;
            });
        }
    },
    loginUser: function () {
        var message = this.message;
        var showProfile = this.showProfile;
        firebase.auth().signInWithEmailAndPassword(this.user.email, this.user.password)
        .then(function(repsonse){
            message.result = 'Logged in !';
            showProfile();
        })
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          message.result = errorMessage;
          // ...
        });
    },
    logout: function(){
        var message = this.message;
        firebase.auth().signOut().then(function() {
          // Sign-out successful.
        }).catch(function(error) {
          // An error happened.
        });
    }
  }
})
