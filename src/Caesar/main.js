function caesarCipher(text, key) {
    let result = "";

    for (let i = 0; i < text.length; i++) {

        let char = text[i];

        
        if (char >= 'A' && char <= 'Z') {
            let code = char.charCodeAt(0) - 65;
            let newCode = (code + key) % 26;
            result += String.fromCharCode(newCode + 65);
        }

        
        else if (char >= 'a' && char <= 'z') {
            let code = char.charCodeAt(0) - 97;
            let newCode = (code + key) % 26;
            result += String.fromCharCode(newCode + 97);
        }

        
        else {
            result += char;
        }
    }

    return result;
}

document.getElementById("btn").addEventListener("click", function () {

    let key = parseInt(document.getElementById("key").value);
    let text = document.getElementById("text").value;

    let encrypted = caesarCipher(text, key);

    document.getElementById("result").textContent = encrypted;
});