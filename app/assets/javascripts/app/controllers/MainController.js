app.controller('MainController', ['Pubnub',
  function(Pubnub){
    Pubnub.init({
      publish_key:'pub-c-fa15cd80-5f66-4437-bb72-453158a151de',
      subscribe_key:'sub-c-1310722c-8202-11e5-ad8e-02ee2ddab7fe'
    });
  }
])
