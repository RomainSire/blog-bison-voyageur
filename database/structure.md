# Structure de la base de données

## Article

| Field            | Type         | Null | Key     | Autre Attributs           | Description                             |
| ---------------- | ------------ | ---- | ------- | ------------------------- | --------------------------------------- |
| id               | SMALLINT     | NO   | PRIMARY | auto_increment ; unsigned |                                         |
| created_at       | DATETIME     | NO   | -       | -                         | date de création                        |
| modified_at      | DATETIME     | NO   | -       | -                         | date de modification                    |
| title            | VARCHAR(255) | NO   | UNIQUE  | -                         | Titre de l'article                      |
| slug             | VARCHAR(255) | NO   | UNIQUE  | -                         | URL de la page de l'article             |
| image_id         | SMALLINT     | YES  | -       | -                         | id de l'image de couverture             |
| content          | TEXT         | YES  | -       | -                         | Contenu de l'article en Markdown        |
| draft            | tinyint(1)   | NO   | -       | -                         | 0 ou 1 : en mode brouillon ou pas ?     |

> **Notes :**  
> id : SMALLINT unsigned = 65 534 articles  
> title & slug = unique  
> coverimg & content peuvent être null lors de l'édition  
> content : TEXT = 65,535 caractères


## Image

| Field            | Type         | Null | Key     | Autre Attributs           | Description                             |
| ---------------- | ------------ | ---- | ------- | ------------------------- | --------------------------------------- |
| id               | SMALLINT     | NO   | PRIMARY | auto_increment ; unsigned |                                         |
| created_at       | DATETIME     | NO   | -       | -                         | date de création                        |
| modified_at      | DATETIME     | NO   | -       | -                         | date de modification                    |
| filename         | VARCHAR(255) | NO   | UNIQUE  | -                         | nom du fichier image                    |
| alt              | VARCHAR(255) | NO   | -       | -                         | texte alternatif pour les liseuses      |

> **Notes :**  
> id : SMALLINT unsigned = 65 534 photos  
> title & slug = unique  


## Menu
Idée pour éditer les menus directement dans le CMS : passer par du JSON:
```json
{
  "home": "slug-home",
  "tour du monde": {
    "Europe": {
      "Suisse": "slug-suisse",
      "Italie": "slug-italie"
    },
    "Asie": {
      "Mongolie": "slug-mongolie"
    }
  }
}
```
Ce menu serait stocké dans une table dédiée, avec :


| Field            | Type         | Null | Key     | Autre Attributs           | Description                             |
| ---------------- | ------------ | ---- | ------- | ------------------------- | --------------------------------------- |
| id               | TINYINT      | NO   | PRIMARY | auto_increment ; unsigned |                                         |
| created_at       | DATETIME     | NO   | -       | -                         | date de création                        |
| modified_at      | DATETIME     | NO   | -       | -                         | date de modification                    |
| json             | TEXT         | NO   | -       | -                         | Contenu du menu en json                 |


> **Notes :**  
> id : TINYINT unsigned = 255 menus  
> json : TEXT = 65,535 caractères
