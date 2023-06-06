describe('Univdataservice tests', function() {
  let player;
  let song;

  beforeEach(function() {
    ///player = new Player();
    ///song = new Song();
  });
  
  /**
   * See also:
   * 1) [real and mock] https://stackoverflow.com/questions/4662641/how-do-i-verify-jquery-ajax-events-with-jasmine/
   * 2) [upgrade 1 to 2, 3, 4] https://jasmine.github.io/tutorials/upgrading_to_2
   * 3) [mock] https://jasmine.github.io/tutorials/mocking_ajax
   * 4) [real 3] https://coderwall.com/p/pbsi7g/testing-ajax-calls-with-jasmine-2
   * 5) [browser or nodejs] https://jasmine.github.io/pages/getting_started.html
   */

  ///////////////////////////////////////////////////////////
  
  
window.getProduct0 = function getProduct0 (id, callback) {
    let subj = $('.mfilter-subject select option:selected').val();
    let yr = $('.mfilter-year select option:selected').val();
    let reg = $('.mfilter-region select option:selected').val();
    
    let urlc = './final/getcntrdata_gmap22.php?year='+yr+'&subj='+subj+'&reg='+reg;
    
    $.ajax({
        type: "GET",
        url: urlc,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: callback,
    });
}

it("should make a real AJAX request", function (done) {
    spyOn(window, 'getProduct0').and.callThrough(); //create a spy
    var callback = function (data) {
        expect(getProduct0).toHaveBeenCalled(); //use the spy instead of callback
        console.warn('test data: ', data);
        done();
    };
    getProduct0(123, callback);
});

});
