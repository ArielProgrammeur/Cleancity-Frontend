export interface Conducteur {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  dateNaissance: string;
  permis: string;
  categoriePermis: string;
  dateEmbauche: string;
  statut: 'actif' | 'inactif' | 'suspendu';
  zone: string;
  vehiculeMarque: string;
  vehiculeModele: string;
  vehiculeImmatriculation: string;
  vehiculeType: string;
  signalementsTraites: number;
  tauxCompletion: number;
  rotation: number;
  tempsMoyen: number;
  derniereActivite: string;
  photoUrl?: string;
}

export type ConducteurStatut = Conducteur['statut'];
