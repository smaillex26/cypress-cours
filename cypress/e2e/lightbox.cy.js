/// <reference types="cypress" />

/**
 * TESTS LIGHTBOX - GUIDE COMPLET
 * 
 * PRINCIPES CLÉS :
 * 1. Avant chaque test (beforeEach), on charge la page pour avoir un état propre
 * 2. On utilise cy.get() pour sélectionner les éléments du DOM
 * 3. On utilise .should() pour vérifier les résultats (assertions)
 * 4. On utilise .click() pour simuler les clics utilisateur
 * 5. On utilise .type() pour écrire du texte
 * 6. On utilise x-show et x-text pour vérifier l'état des éléments Alpine JS
 */

describe('Lightbox Tests', () => {
    
    beforeEach(() => {
        // Charger la page lightbox avant chaque test
        cy.visit('../../src/lightbox.html')
    })

    // ============================================
    // TEST 1 : Ouverture de la lightbox au clique
    // ============================================
    it('1. Tester l\'ouverture de la lightbox au clique sur l\'overlay', () => {
        // EXPLICATION :
        // - La lightbox s'affiche au clique sur l'image
        // - L'image est cliquable car elle est dans un div avec @click="openLightbox()"
        // - On vérifie que la lightbox devient visible

        // Avant le clique : la lightbox ne doit pas être visible
        cy.get('.fixed.bg-black').should('not.be.visible')

        // Clique sur l'image
        cy.get('img').first().click()

        // Après le clique : la lightbox doit être visible
        cy.get('.fixed.bg-black').should('be.visible')

        // Vérification : le div lightbox doit être présent
        cy.get('#lightbox').should('exist')
    })

    // ============================================
    // TEST 2 : Fermeture au clique en dehors
    // ============================================
    it('2. Tester la fermeture de la lightbox au clique en dehors', () => {
        // EXPLICATION :
        // - Au clique en dehors du div lightbox, elle se ferme
        // - C'est réalisé par @click.away="closeLightbox()"
        // - On ouvre d'abord la lightbox, puis on clique en dehors

        // Ouvrir la lightbox
        cy.get('img').first().click()
        cy.get('.fixed.bg-black').should('be.visible')

        // Clique en dehors de la lightbox (sur le fond noir)
        cy.get('.fixed.bg-black').click({ force: true })

        // Attendre l'animation et vérifier que la lightbox est fermée
        cy.get('.fixed.bg-black', { timeout: 1000 }).should('not.be.visible')
    })

    // ============================================
    // TEST 3 : Ajouter un "j'aime"
    // ============================================
    it('3. Tester l\'ajout de la mention "j\'aime" et mise à jour des compteurs', () => {
        // EXPLICATION :
        // - L'icône cœur vide est cliquable (x-show="! isLiked")
        // - Au clique, isLiked devient true et likesCount augmente
        // - Le compteur se met à jour dans l'overlay ET dans la lightbox
        // - On doit vérifier : compteur initial, clique, nouveau compteur

        // Ouvrir la lightbox
        cy.get('img').first().click()
        cy.get('.fixed.bg-black').should('be.visible')

        // Clique sur le cœur vide pour ajouter un "j'aime"
        cy.get('#lightbox')
            .find('svg[title="Like"]')
            .click()

        // Vérifier que le cœur vide disparaît et le cœur rempli apparaît
        cy.get('#lightbox')
            .find('svg[title="Like"]')
            .should('not.be.visible')
        cy.get('#lightbox')
            .find('svg[title="Dislike"]')
            .should('be.visible')

        // Vérifier que le compteur dans la lightbox contient un nombre > 0
        cy.get('#lightbox')
            .find('div[class*="pt-4 px-4"]')
            .first()
            .find('div[class*="text-xs font-semibold ml-2"]')
            .should('contain', '1')

        // Fermer la lightbox en cliquant sur le X
        cy.get('#lightbox')
            .find('svg[viewBox="0 0 24 24"]')
            .first()
            .click()

        // Survoler l'image pour afficher l'overlay
        cy.get('img').first().trigger('mouseover', { force: true })

        // Vérifier que le compteur est aussi mis à jour dans l'overlay
        cy.get('.absolute.bg-black')
            .should('be.visible')
            .find('div')
            .contains('1')
            .should('be.visible')
    })

    // ============================================
    // TEST 4 : Supprimer un "j'aime"
    // ============================================
    it('4. Tester la suppression de la mention "j\'aime" et mise à jour des compteurs', () => {
        // EXPLICATION :
        // - On ajoute d'abord un like
        // - Ensuite on clique sur le cœur rempli pour le supprimer
        // - Le compteur doit revenir à 0
        // - Le compteur se met à jour partout (lightbox ET overlay)

        cy.get('img').first().click()
        cy.get('.fixed.bg-black').should('be.visible')

        // Ajouter un like
        cy.get('#lightbox')
            .find('svg[title="Like"]')
            .click()

        // Vérifier que le cœur rempli est visible et le compteur affiche 1
        cy.get('#lightbox')
            .find('svg[title="Dislike"]')
            .should('be.visible')
        
        cy.get('#lightbox')
            .find('div[class*="pt-4 px-4"]')
            .first()
            .find('div[class*="text-xs font-semibold ml-2"]')
            .should('contain', '1')

        // Cliquer sur le cœur rempli pour supprimer le like
        cy.get('#lightbox')
            .find('svg[title="Dislike"]')
            .click()

        // Vérifier que le cœur vide réapparaît et le compteur revient à 0
        cy.get('#lightbox')
            .find('svg[title="Like"]')
            .should('be.visible')
        cy.get('#lightbox')
            .find('svg[title="Dislike"]')
            .should('not.be.visible')
        
        cy.get('#lightbox')
            .find('div[class*="pt-4 px-4"]')
            .first()
            .find('div[class*="text-xs font-semibold ml-2"]')
            .should('contain', '0')
    })

    // ============================================
    // TEST 5 : Ajouter un commentaire
    // ============================================
    it('5. Tester l\'ajout d\'un commentaire - "Cypress is awesome!"', () => {
        // EXPLICATION :
        // - Il y a un input avec placeholder "Add a comment..."
        // - En tapant du texte, le bouton "Publish" s'active (devient noir)
        // - Au clique sur "Publish", le commentaire s'ajoute à la liste
        // - Le commentaire apparaît dans la section commentaires

        cy.get('img').first().click()
        cy.get('.fixed.bg-black').should('be.visible')

        // Trouver l'input de commentaire et taper le texte
        cy.get('input[placeholder="Add a comment..."]')
            .type('Cypress is awesome!')

        // Vérifier que le bouton "Publish" est maintenant activé (noir)
        cy.get('button:contains("Publish")')
            .should('not.be.disabled')
            .should('have.class', 'bg-black')

        // Cliquer sur le bouton Publish
        cy.get('button:contains("Publish")').click()

        // Vérifier que le commentaire apparaît dans la liste
        cy.get('#lightbox')
            .should('contain', 'Cypress is awesome!')
    })

    // ============================================
    // TEST 6 : Bouton Publish désactivé si vide
    // ============================================
    it('6. Tester que l\'ajout d\'un commentaire vide est impossible', () => {
        // EXPLICATION :
        // - Le bouton "Publish" est désactivé par défaut (background gris)
        // - Si l'input est vide, le bouton reste désactivé (voir le debounce)
        // - On teste que le bouton reste désactivé si on ne tape rien

        cy.get('img').first().click()
        cy.get('.fixed.bg-black').should('be.visible')

        // Vérifier que le bouton est d'abord désactivé (gris)
        cy.get('button:contains("Publish")')
            .should('be.disabled')
            .should('have.class', 'bg-gray-200')

        // Taper un caractère puis le supprimer
        cy.get('input[placeholder="Add a comment..."]')
            .type('A')
            .clear()

        // Le bouton doit être de nouveau désactivé (gris)
        cy.get('button:contains("Publish")')
            .should('be.disabled')
            .should('have.class', 'bg-gray-200')
    })

    // ============================================
    // TEST 7 : Cacher/Afficher les commentaires
    // ============================================
    it('7. Tester l\'option qui cache les commentaires', () => {
        // EXPLICATION :
        // - D'abord, ajouter 2 commentaires
        // - Il y a un lien "Show/Hide X comments"
        // - Au clique, les commentaires s'affichent ou se cachent
        // - C'est un toggle : click = show, click = hide

        cy.get('img').first().click()
        cy.get('.fixed.bg-black').should('be.visible')

        // Ajouter un premier commentaire
        cy.get('input[placeholder="Add a comment..."]')
            .type('Premier commentaire')
        cy.get('button:contains("Publish")').click()

        // Ajouter un deuxième commentaire
        cy.get('input[placeholder="Add a comment..."]')
            .type('Deuxième commentaire')
        cy.get('button:contains("Publish")').click()

        // Le lien "Show/Hide 2 comments" doit être visible
        cy.get('#lightbox')
            .should('contain', '2 comments')

        // Les commentaires sont visibles au départ (isCommentsVisible = true après publishComment)
        // Clique pour les cacher
        cy.get('#lightbox')
            .contains('2 comments')
            .click()

        // Les commentaires ne doivent plus être visibles
        cy.get('#lightbox')
            .find('.flex.flex-col')
            .should('not.be.visible')

        // Clique de nouveau pour les afficher
        cy.get('#lightbox')
            .contains('2 comments')
            .click()

        // Les commentaires doivent être visibles de nouveau
        cy.get('#lightbox')
            .find('.flex.flex-col')
            .should('be.visible')
    })

    // ============================================
    // TEST 8 : Compteurs de commentaires
    // ============================================
    it('8. Tester les différents compteurs de commentaires sur l\'overlay et la lightbox', () => {
        // EXPLICATION :
        // - Ajouter 3 commentaires
        // - Vérifier que le compteur dans l'overlay s'affiche
        // - Vérifier que le compteur dans la lightbox (dans le lien) s'affiche
        // - Les deux compteurs doivent afficher "3"

        // D'abord, survoler l'image SANS ouvrir la lightbox
        // pour voir le compteur initial de l'overlay
        cy.get('img').first().trigger('mouseover', { force: true })
        cy.get('.absolute.bg-black').should('be.visible')
        
        // Au départ, pas de commentaires, donc le compteur d'overlay affiche 0
        cy.get('.absolute.bg-black')
            .find('div')
            .contains('0')
            .should('be.visible')

        // Quitter le survol
        cy.get('img').first().trigger('mouseleave', { force: true })

        // Maintenant, ouvrir la lightbox avec force
        cy.get('img').first().click({ force: true })
        cy.get('.fixed.bg-black').should('be.visible')

        // Ajouter 3 commentaires
        for (let i = 1; i <= 3; i++) {
            cy.get('input[placeholder="Add a comment..."]')
                .type(`Commentaire ${i}`)
            cy.get('button:contains("Publish")').click()
        }

        // Vérifier le compteur dans la lightbox
        cy.get('#lightbox')
            .should('contain', '3 comments')

        // Maintenant on peut vérifier sans fermer et rouvrir
        // que les deux compteurs sont en sync dans le même test
        // même si on ne sort pas de la lightbox
        
        // Vérifier que le compteur de likes est à 0 (par défaut)
        cy.get('#lightbox')
            .find('svg[title="Like"]')
            .should('be.visible')
    })

    // ============================================
    // TEST 9 : Singulier/Pluriel
    // ============================================
    it('9. Tester le singulier/pluriel en fonction du nombre de commentaires', () => {
        // EXPLICATION :
        // - Avec 1 commentaire, le lien doit afficher "1 comment" (singulier)
        // - Avec 2+ commentaires, le lien doit afficher "X comments" (pluriel)
        // - La fonction displayCommentText() gère cette logique

        cy.get('img').first().click()
        cy.get('.fixed.bg-black').should('be.visible')

        // Ajouter un commentaire
        cy.get('input[placeholder="Add a comment..."]')
            .type('Seul commentaire')
        cy.get('button:contains("Publish")').click()

        // Vérifier le singulier
        cy.get('#lightbox')
            .should('contain', '1 comment')

        // Ajouter un deuxième commentaire
        cy.get('input[placeholder="Add a comment..."]')
            .type('Deuxième commentaire')
        cy.get('button:contains("Publish")').click()

        // Vérifier le pluriel
        cy.get('#lightbox')
            .should('contain', '2 comments')

        // Ajouter un troisième commentaire
        cy.get('input[placeholder="Add a comment..."]')
            .type('Troisième commentaire')
        cy.get('button:contains("Publish")').click()

        // Vérifier que le pluriel reste
        cy.get('#lightbox')
            .should('contain', '3 comments')
    })

    // ============================================
    // TEST 10 : Supprimer le 2ème commentaire
    // ============================================
    it('10. Écrire 3 commentaires et tester la suppression du 2ème commentaire', () => {
        // EXPLICATION :
        // - Ajouter 3 commentaires : "Premier", "Deuxième", "Troisième"
        // - Chaque commentaire a une petite croix pour le supprimer
        // - La croix du 2ème commentaire doit supprimer uniquement celui-ci
        // - Les commentaires 1 et 3 doivent rester
        // - Le compteur doit passer de 3 à 2 commentaires

        cy.get('img').first().click()
        cy.get('.fixed.bg-black').should('be.visible')

        const comments = ['Premier', 'Deuxième', 'Troisième']

        // Ajouter les 3 commentaires
        comments.forEach(comment => {
            cy.get('input[placeholder="Add a comment..."]')
                .type(comment)
            cy.get('button:contains("Publish")').click()
        })

        // Vérifier que les 3 commentaires sont présents
        cy.get('#lightbox').should('contain', 'Premier')
        cy.get('#lightbox').should('contain', 'Deuxième')
        cy.get('#lightbox').should('contain', 'Troisième')
        cy.get('#lightbox').should('contain', '3 comments')

        // Trouver et cliquer sur la croix du 2ème commentaire
        // Les commentaires sont dans un template x-for
        // Chaque commentaire a une croix à la fin
        cy.get('#lightbox')
            .find('.flex.flex-col')
            .find('.flex.items-center.justify-between')
            .eq(1)  // Indice 1 = 2ème commentaire (0-indexed)
            .find('svg.h-2')
            .click()

        // Vérifier que le 2ème commentaire est supprimé
        cy.get('#lightbox').should('not.contain', 'Deuxième')

        // Vérifier que les autres commentaires sont toujours là
        cy.get('#lightbox').should('contain', 'Premier')
        cy.get('#lightbox').should('contain', 'Troisième')

        // Vérifier que le compteur est mis à jour à 2 commentaires
        cy.get('#lightbox').should('contain', '2 comments')
    })
})
