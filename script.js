// Brian Chrzanowski (C) 2023
// Create a 5x5 Bingo Board with all (or none) of the Inputs

const { jsPDF } = window.jspdf;

function generate(arr, count) {
    let outputs = [];

    for (let i = 0; i < count; i++) {
        let board = [];

        let currs = [...arr];

        for (let j = 0; j < 25; j++) {
            if (j == 12) {
                board.push("FREE");
                continue;
            }

            const index = Math.floor(Math.random() * currs.length);
            let item = currs.splice(index, 1)[0];
            board.push(item);
        }

        outputs.push(board);
    }

    return outputs;
}

function createPDFs(boards) {
    let doc = new jsPDF();

    doc.setTextColor(0, 0, 0);
    doc.setProperties({
        title: `bingo-${new Date().toISOString()}`
    });

    const columns = ["B", "I", "N", "G", "O"];
    const sideLength = 35;
    const headerStyle = { fillColor: "#ffffff", textColor: "#000000" };
    const rowStyle = { };

    for (let i = 0; i < boards.length; i++) {
        const xStart = 18;

        let x = xStart;

        // draw table headers
        columns.forEach((column, index) => {
            doc.setFillColor(headerStyle.fillColor);
            doc.setTextColor(headerStyle.textColor);

            const textOptions = {
                maxWidth: sideLength - 2,
                align: "center"
            };

            const dx = (index * sideLength) + xStart;
            const dy = 15;

            const tx = dx + 2 + 15;
            const ty = dy + 2;

            doc.rect(dx, 10, sideLength, 8);
            doc.text(column, tx, ty, textOptions);
            x += sideLength;
        });

        x = xStart;

        // we just use the first board for now...
        const curr = boards[i];

        for (let y = 0; y < 5; y++) {
            for (let x = 0; x < 5; x++) {
                doc.setFillColor(headerStyle.fillColor);
                doc.setTextColor(headerStyle.textColor);

                const dx = (x * sideLength) + xStart;
                const dy = (y * sideLength) + xStart;

                const tx = dx + 2 + 15;
                const ty = dy + 2 + 10;

                const textOptions = {
                    maxWidth: sideLength - 2,
                    align: "center"
                };

                doc.rect(dx, dy, sideLength, sideLength);
                doc.text(curr[y * 5 + x], tx, ty, textOptions);
            }
        }

        if (i < boards.length - 1) {
            doc.addPage();
        }
    }

    doc.output('dataurlnewwindow');
}

function handleSubmit() {
    // Get all of the text from the textarea

    const input = document.getElementById("bingo_input");
    if (!input) {
        alert("Could not find input!");
        return;
    }

    const count = document.getElementById("bingo_cards");
    if (!count) {
        alert("Could not find the count!");
        return;
    }

    let n = parseInt(count.value) ?? 1;

    let inputs = input.value.split("\n").filter(x => x && x.length > 0);
    if (inputs.length < 24) {
        alert("Not enough inputs were supplied! You need at least '24', you gave '" + inputs.length + "'.");
        return;
    }

    let outputs = generate([...inputs], n);

    createPDFs(outputs);
}
