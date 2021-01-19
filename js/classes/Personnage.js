var DIM_PJ=32;

function Personnage(url, x, y, direction,idx) {
	this.idx = idx;
	this.x = x; // (en cases)
	this.y = y; // (en cases)
	
	this.direction = direction;
	 
	// Chargement de l'image dans l'attribut image
	this.image = new Image();
	this.image.referenceDuPerso = this;
	this.image.onload = function() {
		if(!this.complete) 
			throw "Erreur de chargement du sprite nommé \"" + url + "\".";
		
		// Taille du personnage
		this.referenceDuPerso.largeur = this.width / 4;
		this.referenceDuPerso.hauteur = this.height / 4;
	}
	this.image.src = "sprites/" + url;
}

Personnage.prototype.dessinerPersonnage = function(context) {
	context.drawImage(
			this.image, 
			0, this.direction * this.hauteur, // Point d'origine du rectangle source à prendre dans notre image
			this.largeur, this.hauteur, // Taille du rectangle source (c'est la taille du personnage)
			(this.x * 32) - (this.largeur / 2) + 16, (this.y * 32) - this.hauteur + 24, // Point de destination (dépend de la taille du personnage)
			this.largeur, this.hauteur // Taille du rectangle destination (c'est la taille du personnage)
    );

}
Personnage.prototype.cliquerDedans = function (clic_y,clic_x){
    var dedans = false;
	
	var max_x = (this.x * DIM_PJ) + DIM_PJ;
	var max_y = (this.y  * DIM_PJ) + DIM_PJ;
	
	if ((clic_x>= (this.x * DIM_PJ) && clic_x<=max_x)
	   && (clic_y>= (this.y * DIM_PJ) && clic_y<=max_y)) {
	      dedans = true;
	}
	
	return dedans;   
}

Personnage.prototype.getCoordonneesAdjacentes = function(direction)  {
	var coord = {'x' : this.x, 'y' : this.y};
	switch(direction) {
		case DIRECTION.BAS : 
			coord.y++;
			break;
		case DIRECTION.GAUCHE : 
			coord.x--;
			break;
		case DIRECTION.DROITE : 
			coord.x++;
			break;
		case DIRECTION.HAUT : 
			coord.y--;
			break;
	}
	return coord;
}
Personnage.prototype.etreDansVue = function(coord){
    // Hors des limites 0]:[DIM_VIEW
	if((coord.x < 0 || coord.y < 0) || (coord.x >= DIM_VIEW || coord.y >= DIM_VIEW)) {
	    return false;
	} else {
		return true;
	}
}
Personnage.prototype.etreDansMap = function(coord,m){
    var dedans=false;
	// Hors des limites 0]:[DIM_VIEW
	if(coord.x < 0 || coord.y < 0){
	    dedans= false;
	} else {
		if(coord.x >= m.getLargeur() || coord.y > m.getHauteur()) {
	    dedans= false;
		} else 
		   dedans =true;
	}
	return dedans;
}
Personnage.prototype.etreDansVM = function (coord,m){
	//Calculer nouvelle coordonnees
	var ecart_w= DIM_VIEW - m.getLargeur;
	var ecart_h= DIM_VIEW - m.getHauteur;
			
    // NEGATIFS:
	// <0 et sort de la vue
	if(coord.x < 0 || coord.y < 0){
	  // SI dépasse carte
	  if (coord.x<ecart_w || coord.y< ecart_h){
	    return false;
	  }
	}
	// POSITIFS:
	// >view.l et view.w
	if (coord.x >= m.getLargeurV || coord.y >= m.getHauteurV()) {
	  if ((coord.x+DIM_VIEW > m.getLargeurV) || (coord.y+DIM_VIEW > m.getHauteurV)){
	    return false;
	  }
	}
	return true;
}
Personnage.prototype.replacer = function(direction, m, idxpj) {

	var prochaineCase = this.getCoordonneesAdjacentes(direction);
	this.x = prochaineCase.x;
	this.y = prochaineCase.y;
}
Personnage.prototype.deplacer = function(direction, m, idxpj) {
	
    // On vérifie que la case demandée est bien située dans la carte
	var prochaineCase = this.getCoordonneesAdjacentes(direction);
	
	// tester si dans CARTE mais sort de la vue
	if (this.etreDansVM(prochaineCase,m)){
	   if (!this.etreDansVue(prochaineCase)){
	        //Déplacer la VUE
			m.deplacerVue(direction);
			
			// gérer le replacement des autres ???
			var dir_inv=m.inverser(direction);
			for(var i=0;i<m.getPersonnages().length;i++){
			  //alert("i="+i+" idxpj="+idxpj+" !="+(i!=idxpj));
			  if (i!=idxpj){
			     m.personnages[i].replacer(dir_inv,m,i);
			  }
			}	
	   } else{	        
			// On change la direction du personnage
			this.direction = direction;
			// On effectue le déplacement ud PJ: idxpj
			this.x = prochaineCase.x;
			this.y = prochaineCase.y;
	   }
	}	
	return true;
}
Personnage.prototype.toString = function(){
  return "Perso:"+this.idx+" ["+this.y+":"+this.x+"]";
}
