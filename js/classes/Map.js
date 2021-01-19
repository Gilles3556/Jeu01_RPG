var DIRECTION= {
"BAS":0,
"GAUCHE":1,
"DROITE":2,
"HAUT":3
}

/* CLASSE MAP */
var DIM_VIEW=15;

var OBJETS={
	"ARBRE": 17,
	"TONNEAU": 18,
	"PORTE_NEXT": 19,
	"PORTE_PREV": 20
}
function Map(nom){
	this.nom = nom;
	console.log("Constructeur MAP:" + this.nom);
	var xhr = getXMLHttpRequest();
	xhr.open("GET","./maps/premiere_"+this.nom+".json",false);
	xhr.send(null);
	if (xhr.readyState !=4 || (xhr.status !=200 && xhr.status !=0))
	   throw new Error("Impossible de charger la CARTE nommée\""+this.nom+"\" (codeHTTP: "+xhr.status+").");
	var mapJsonData = xhr.responseText;
	
	var mapData = JSON.parse(mapJsonData);
	this.tileset = new Tileset(mapData.tileset);
	this.terrain = mapData.terrain;

	this.personnages = new Array();
	
  this.ligDepart=0;
	this.colDepart=0;
	this.mapView= new Array();
}

//Getters
Map.prototype.getHauteur = function(){
  return this.terrain.length;	
}
Map.prototype.getLargeur = function(){
  return this.terrain[0].length;	
}
Map.prototype.getTerrain = function(){
  return this.terrain;	
}
Map.prototype.getView = function(){
  return this.mapView;	
}
Map.prototype.getLargeurV = function(){
  return this.mapView[0].length;	
}
Map.prototype.getHauteurV = function(){
  return this.mapView.length;	
}
Map.prototype.getPersonnages = function(){
  return this.personnages;	
}
//METHODES
/* MEP d'une vue: carré de 15 sur 15
à partir des coordonnées du joueurs */
Map.prototype.buildView = function(){
  this.mapView= new Array();
  for(var i=this.ligDepart; i< this.ligDepart+DIM_VIEW; i++){
      var ligne = this.terrain[i];
	  var ligneNew= new Array();
	  for(var j=this.colDepart, k= this.colDepart+DIM_VIEW; j<k;j++){   
		 var cellule= this.terrain[i][j];
	     ligneNew.push(cellule);
	  }
	  this.mapView.push(ligneNew);    
  }
}

Map.prototype.dessinerViewMap = function(context){
	this.buildView();
	 //MAP
	 for(var i=0, l=this.mapView.length;i<l; i++){
	 //console.log("LIG:"+i);
		var ligne = this.mapView[i];
		var y = i *32;
		for(var j=0, k= ligne.length; j<k;j++){
			this.tileset.dessinerTile(ligne[j],context, j*32,y);
		}
	 }
}

Map.prototype.addPersonnage = function (perso){
	this.personnages.push(perso);
}
Map.prototype.dessinerPJ = function(context){
	 //Personnages
	 for(var i2=0,l2=this.personnages.length;i2<l2;i2++){
		//console.log(this.personnages[i2].toString());
		this.personnages[i2].dessinerPersonnage(context);
	 }
}

Map.prototype.deplacerVue = function(dir){
  // Ecarts de dimension entre VUE et MAP
  var diff_h= this.getHauteur()-DIM_VIEW; // ecart en height
  var diff_w= this.getLargeur()-DIM_VIEW;  // ecart en width
  
  switch(dir){
		case DIRECTION.HAUT:
			this.ligDepart--;  // -1
			if (this.ligDepart<0){
					this.ligDepart= 0; 
			}
			break;
		case DIRECTION.BAS:
			this.ligDepart++;
			//console.log("\nDIFF_H="+diff_h);
			//console.log("AVANT ligDepart="+this.ligDepart);
			if (this.ligDepart>diff_h){
				this.ligDepart= diff_h;
				console.log("APRES ligDepart="+this.ligDepart); 
			}
			break;
		case DIRECTION.DROITE:
			this.colDepart++;
			//console.log("\nDIFF_W="+diff_w);
			//console.log("AVANT colDepart="+this.colDepart);
			if (this.colDepart>diff_w){
				this.colDepart=diff_w;
			}
			break;
		case DIRECTION.GAUCHE:
			this.colDepart--;
			if (this.colDepart<0){
			 this.colDepart=0;
			}
			break;
  }
}
Map.prototype.inverser = function(direction){
    var dir_inverse=0; 
  
	switch(direction) {
		case DIRECTION.BAS : 
			dir_inverse = DIRECTION.HAUT;
			break;
		case DIRECTION.GAUCHE : 
			dir_inverse = DIRECTION.DROITE;
			break;
		case DIRECTION.DROITE : 
			dir_inverse = DIRECTION.GAUCHE;
			break;
		case DIRECTION.HAUT : 
			dir_inverse = DIRECTION.BAS;
			break;
	}
  return dir_inverse;
}
Map.prototype.deplacerAutrePerso = function (direction,idxpj){
    
	 var newDir = inverser(direction);
     alert("DIR:"+direction+" NEW_DIR="+newDir);
     
	 for(var i2=0,l2=this.personnages.length;i2<l2;i2++){
		if (i2 != idxpj){
           map.personnages[i2].deplacer(newDir, map);			 
		}
	 }
}
Map.prototype.isRoom = function (pjidx){
	  room = false;
    var lig= this.personnages[pjidx].y+this.ligDepart;
	  var col= this.personnages[pjidx].x+this.colDepart;

		if ( (this.terrain[lig][col] == OBJETS.PORTE_NEXT) || (this.terrain[lig][col]==OBJETS.PORTE_PREV) ){
			alert("Bienvenue jeune LUKE SKYWALKER");
			room = true;
		}
		if (this.terrain[lig][col]==OBJETS.TONNEAU){
			alert("In vino veritas !!");
			this.personnages[pjidx].redonnerVie();
		}
	return room;
}
Map.prototype.isDoor = function (pjidx){
	mapSuivante = 0;
  var lig= this.personnages[pjidx].y+this.ligDepart;
	var col= this.personnages[pjidx].x+this.colDepart;
	
	if (this.terrain[lig][col]==OBJETS.PORTE_NEXT){
		 mapSuivante = 1;
	}
	if (this.terrain[lig][col]==OBJETS.PORTE_PREV){
		mapSuivante = -1;
  }
 
	return mapSuivante;
}

//PBM lors du déclage de la vue sur la carte
Map.prototype.isTerrainAutorise = function (lig, col){
	terrainOk = true;
  if (this.terrain[lig][col] == 2){
     terrainOk = false;
	}
	console.log("["+lig+":"+col+" terrain="+this.terrain[lig][col] +"] depl:"+terrainOk);
	return terrainOk;
}

