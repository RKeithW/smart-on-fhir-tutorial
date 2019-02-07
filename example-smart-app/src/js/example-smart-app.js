(function(window){
  window.extractData = function() {
    var ret = $.Deferred();

    function onError() {
      console.log('Loading error', arguments);
      ret.reject();
    }

    function onReady(smart) {
      if (smart.hasOwnProperty('patient')) {

        $('#fhirid').html(smart.tokenResponse.patient);

        var patient = smart.patient;
        var pt = patient.read();
        var pr = smart.api.read( {"type": "Practitioner", "id": "https://fhir-ehr.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/Practitioner/4464007" } );

        $.when(pt, pr).fail(onError);

        $.when(pt, pr).done(function (patient) {

          var p = defaultPatient();
          p.id = patient.id;
          p.mrn = patient.identifier[0].value;
          p.pract = JSON.stringify( pr );

          ret.resolve(p);
        });
      } else {
        onError();
      }
    }


    FHIR.oauth2.ready(onReady, onError);

    return ret.promise();

  };

  function defaultPatient(){
    return {
      id: {value: ''},
      mrn: {value: ''},
      pract: {value:''}
    };
  }


  window.drawVisualization = function(p) {

    $('#holder').show();
    $('#loading').hide();
//    $('#fhirid').html(p.id);
    $('#mrn').html(p.mrn);
    $('#pract').html(p.pract);
//    window.location = "http://localhost:1080/cernercontext/?partnerId=999999999999999-9999999999999";

  };

})(window);
