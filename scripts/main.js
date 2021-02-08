//main block for doing the audio recording

if (navigator.mediaDevices.getUserMedia) {
   console.log('getUserMedia supported.');
   navigator.mediaDevices.getUserMedia (
      // constraints - only audio needed for this app
      {
         audio: false,
         video: true
      })
      .then(
      // Success
      function(stream) {

        var video = document.createElement('video');
        var videoURL;
        try {
          window.URL.createObjectURL(stream);
          video.src = videoURL;
        } catch(e) {
          if (videoURL) {
            window.URL.revokeObjectURL(videoURL)
          }
          video.srcObject = stream;
        }
        video.onloadedmetadata = function() {
         video.play();
         threeRender(video);
        };
      })
      .catch(function(err) {
         console.log('The following gUM error occured: ' + err);
      });
} else {
   console.log('getUserMedia not supported on your browser!');
}

// three.js cube drawing

function threeRender(video) {

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// load a texture, set wrap mode to repeat
var texture = new THREE.Texture(video);
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set( 1, 1 );

var geometry = new THREE.BoxGeometry(3,3,3);
var material = new THREE.MeshLambertMaterial( { map: texture, shading: THREE.FlatShading } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );
camera.position.z = 5;

var light = new THREE.AmbientLight( 'rgb(255,255,255)' ); // soft white light
scene.add( light );

// White directional light at half intensity shining from the top.
//var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
//directionalLight.position.set( 0, 1, 0 );
//scene.add( directionalLight );

// white spotlight shining from the side, casting shadow
var spotLight = new THREE.SpotLight( 'rgb(255,255,255)' );
spotLight.position.set( 100, 1000, 1000 );
spotLight.castShadow = true;
spotLight.shadowMapWidth = 1024;
spotLight.shadowMapHeight = 1024;
spotLight.shadowCameraNear = 500;
spotLight.shadowCameraFar = 4000;
spotLight.shadowCameraFov = 30;
scene.add( spotLight );

//render the scene

function render() {
  requestAnimationFrame(render);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  texture.needsUpdate = true;
  renderer.render(scene, camera);
}

render();

}
