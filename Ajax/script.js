document.addEventListener("DOMContentLoaded", () => {
    const boardsContainer = document.getElementById("boards");

    // Funkce pro načítání dat z API MVČR
    async function loadBoards() {
        try {
            const response = await fetch("https://opendata.mvcr.cz/api/boards/");
            const boards = await response.json();

            boards.forEach(board => {
                const boardElement = document.createElement("div");
                boardElement.classList.add("item");

                // HTML struktura pro zobrazení dat dle struktury API
                boardElement.innerHTML = `
                    <h3>${board.typ || 'Název nedostupný'}</h3>
                    <p><strong>IRI:</strong> ${board.iri || 'Není k dispozici'}</p>
                    <p><strong>Stránka:</strong> <a href="${board.stránka}" target="_blank">${board.stránka || 'Není k dispozici'}</a></p>
                    <p><strong>Provozovatel (IČO):</strong> ${board.provozovatel?.ičo || 'Není k dispozici'}</p>
                    <h4>Informace na úřední desce:</h4>
                `;

                // Zobrazení informací na úřední desce
                const infoList = document.createElement("div");
                board.informace.forEach(info => {
                    const infoElement = document.createElement("div");
                    infoElement.innerHTML = `
                        <p><strong>Název:</strong> ${info.název?.cs || 'Není k dispozici'}</p>
                        <p><strong>Číslo jednací:</strong> ${info.číslo_jednací || 'Není k dispozici'}</p>
                        <p><strong>Vyvěšení:</strong> ${info.vyvěšení?.datum || 'Není k dispozici'}</p>
                        <p><strong>URL:</strong> <a href="${info.url}" target="_blank">${info.url || 'Není k dispozici'}</a></p>
                    `;
                    infoList.appendChild(infoElement);

                    // Zobrazení dokumentu, pokud existuje
                    info.dokument.forEach(doc => {
                        const docElement = document.createElement("div");
                        docElement.innerHTML = `
                            <p><strong>Dokument:</strong> <a href="${doc.url}" target="_blank">${doc.název?.cs || 'Dokument bez názvu'}</a></p>
                        `;
                        infoList.appendChild(docElement);
                    });
                });

                boardElement.appendChild(infoList);
                boardsContainer.appendChild(boardElement);
            });
        } catch (error) {
            boardsContainer.innerHTML = "<p>Nepodařilo se načíst data z API.</p>";
            console.error("Chyba při načítání dat:", error);
        }
    }

    // Načti boardy při načtení stránky
    loadBoards();
});
