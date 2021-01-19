/*No des image:
17: arbre
18: tonneau
19: maison bleue
*/
function Tileset(url){
  this.image = new Image();
  this.image.referenceDuTileset = this;
  
  this.image.onload= function(){
      if (!this.complete)
	     throw new Error("Erreur de chargement du TILESET nommé \""+url+"\".");
	  this.referenceDuTileset.largeur = this.width /32;
  }
  this.image.src="tilesets"+url;
}
//Methode de dessin du tile numéro ds le context 2d aux coordonnées x et y
Tileset.prototype.dessinerTile = function(num, context, xDest, yDest){
	var xSourceEnTiles = num % this.largeur;
    if (xSourceEnTiles  ==0) xSourceEnTiles =this.largeur;
	var ySourceEnTiles = Math.ceil(num / this.largeur);
	
	var xSce= (xSourceEnTiles -1) *32;
	var ySce= (ySourceEnTiles -1) *32;
	context.drawImage(this.image,xSce,ySce,32,32,xDest,yDest,32,32);
	
}