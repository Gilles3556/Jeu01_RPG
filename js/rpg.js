﻿var TOUCHE ={ // H: 38 | B: 40 | D: 39 | G: 37 | ENTREE: 13
	"F_BAS":40,
	"F_GAUCHE":37,
	"F_DROITE":39,
	"F_HAUT":38,
	"F_ENTREE": 13
	}
var DIM=32;
var pj_idx=0;
var PV_MAX=200;

// tuile
var ts = new Tileset("/basique.png");
//CR MAP
var map = new Map(1);

//MEP des Persos
map.addPersonnage(new Personnage("soldat13.png",7,7,DIRECTION.BAS,0,PV_MAX)); // AVT: 7,14
//map.addPersonnage(new Personnage("exemple.png",14,7,DIRECTION.GAUCHE,1));
	 
function majMonde(){
	document.getElementById("laMap").innerHTML = "<h2>Monde: " + map.nom + "</h2>";
}
function majPj(perso){
	document.getElementById("pj").innerHTML = "<h2>Vie: " + perso.ptVie + "</h2>";
}

window.onload = function(){
	majMonde();
	majPj(map.personnages[pj_idx]);
	var canvas = document.getElementById("canvas");
	
	var canv_l=canvas.offsetLeft;
	var canv_t=canvas.offsetTop;
	// Détecter le CLIC sur un PJ
	canvas.addEventListener('click',function(event){
	  var clic_x= event.pageX - canv_l;
	  var clic_y= event.pageY - canv_t;
	  
	  map.personnages.forEach(function(perso){
			if (perso.cliquerDedans(clic_y,clic_x)){
			    pj_idx=perso.idx;
			}	  
	  });
	});
	
	var ctx = canvas.getContext('2d');
	
    canvas.width = 15 * DIM;
	canvas.height = 15 * DIM;
	
    paintAll(ctx);	
   
	window.onkeydown = function(event){

	  var e = event || window.event;
	  var key = e.wich || e.keyCode;
	  // Flèches clavier:
	  // H: 38 | B: 40 | D: 39 | G: 37 | ENTREE: 13
	 switch(key) {
			case 13:
				if (map.isRoom(pj_idx)){
				console.log("53: Is ROOM: ENTREZ DONC!");
				oldPerso = map.personnages[pj_idx];
				oldMapNom = map.nom;
				
				if (map.isDoor(pj_idx) == 1) {
					// MAP suivante:
					leNom = oldMapNom + 1;
				} else{
					//MAP précédente
					leNom = oldMapNom - 1;
				}
				map = new Map(leNom);	
				map.addPersonnage( oldPerso);
				majMonde();
				paintAll(ctx);	
				}
				
			break;
			case 38 : case 122 : case 119 : case 90 : case 87 : // Flèche haut,	z, w, Z, W
				map.personnages[pj_idx].deplacer(DIRECTION.HAUT, map, pj_idx);
			break;
			case 40 : case 115 : case 83 : // Flèche bas, s, S
				map.personnages[pj_idx].deplacer(DIRECTION.BAS, map, pj_idx);
			break;
			case 37 : case 113 : case 97 : case 81 : case 65 : // Flèche gauche, q, a, Q, A
				map.personnages[pj_idx].deplacer(DIRECTION.GAUCHE, map, pj_idx);
			break;
			case 39 : case 100 : case 68 : // Flèche droite, d, D
				map.personnages[pj_idx].deplacer(DIRECTION.DROITE, map, pj_idx);
			break;
			default :
				// Si la touche ne nous sert pas, nous n'avons aucune raison de bloquer son comportement normal.
			return true;
		}
		map.dessinerViewMap(ctx);
		majPj(map.personnages[pj_idx]);
	 return false;
	}
}
function paintAll(ctx){

 setInterval(function(){	 
		map.dessinerViewMap(ctx);
		map.dessinerPJ(ctx);
		},40);	
}

function deplacerMap(dir){
  var ctx2 = canvas.getContext('2d');
  map.deplacerVue(dir);
  map.dessinerViewMap(ctx2);
  
  map.dessinerPJ(ctx2);
}
