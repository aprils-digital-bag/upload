const SERVICE_ACCOUNT_EMAIL = 'april-s-bag-bot@triple-kingdom-449202-d7.iam.gserviceaccount.com'; // From JSON key
const PRIVATE_KEY = `\nMIIEuwIBADANBgkqhkiG9w0BAQEFAASCBKUwggShAgEAAoIBAQCxdokE0mEyBF8L\n5GdPG3FTCHyiEMNE3plYnChySfit0X0fSHU34FGw0EVLJqscOh0ZMBApFyDbcCDO\ndXegb4bSjUlWRYWNS4Tfhhser5tVpFhuJo6WD3lvJsnHXkVBYN7gh2yE4heWeCZ7\nM3WS+Odxd57pmffesDW+GqA0zRUpe6pW04YCCD/ykk3gi/4s7EsHxRf62YmvNt9y\neb/pmuKtRSo3LB8GsDr81n0G4mgh4QlzPFNVYDQR4wu3pPGnLdTG0lNV/ZJZ4Phz\naN5dVhx2ac0S83N1MSEdNjQuJOaDOKLS2whwMVHXcAwGa9vB6U3OeZSt6dL90V3k\nZgvQ65pRAgMBAAECgf9gExUfbuCVarJZstAPJOSLWD+lqe2Rwx1yauNOpEY9WH5e\nLOK7t+iB/0gRsE4aapDNfjoDvkYj1ke3kBFZF3HbN6+ZIeJ9YK3/Zug6hleqfz97\nNq+eVJqcTgA6h3RlVAXRLA0fKmtYhE4tr+EPj28M2Wi6E6NVBGShSzc//ZtElMEp\nJ98wAeWLCBBQMPWzF9bBSrU3+PksIB2E9hltvXP3tCWE93pcdh6pPCiOXSpfXU/R\nMGXzxNL6MMF8+ss3U5fCN3er4x+fpT4dAd/6CmrKmgyHUooGZwUhuBVPtXX3zM5a\n3rVsElQBrRj2tfqLXnKC0sEjOsdxLNn63DPpXL0CgYEA3vRyOSaFOvh6Af3dIdlb\nLy3nFaFf7k+bsCfDrXp7qkNBBnJjd4L9698Y4XaqN8nivMkKa8aO6tqP+kMmkxPW\nP3JYVjQAkEEju9LcqQWqrkYhFkVejQnwc8RI1DjTBzwNWDYjZ897yPAumi3NWwex\nBQcj9a1omMosQFGz4Si2Qs0CgYEAy8P/LxVoyA5vMzBApPSdF3tcA/x3vVdNhUPp\n5/6V7LqeESwPgJTMeXgSTZce7E/xwwGUsX3qrtB25SUMAyoCebyVyY6A+kYyeQ5W\n4wg9lH3sXeakz0sdoE6IkKS7yQp3EvntD2iSM0Q1U23PEGTt25tZFGneChEUh8xE\nHf1bnZUCgYAnCaASV6dOSwF55cxZR+iKWzwx8l6MqI23C09cyaxrhHkXOuIlo973\n9MkzeQaW3BeCPKVBd7PAdWJuTGGtsPR7iXbkKRjMKUurcGFIiwB2oTrb3muOwGXE\nr2KdHhH9G0uu3VPXsmGXLk7KmihxvugE3Fo0gxdkYUncPTIEw48eJQKBgQDIXtKH\nvTjNSQxmPLPEwdncJm0kalZgtQHA4ziW7k0FfblDz5zq5udvJvhwngNFg5OMG/jY\n1KY7Azl3OQfn8J6AkUaF7gC8mty1F7mvBQJxC6ar68rzIL1gTvmRqrwSBJ105pkL\nhtwFV7RMdvWf/G+9fLSLE1PJeGRE6UOubd5yRQKBgCPaDjUgApi+zEZ1YFcHcf5Y\nldZvZASSrEdY3tNAy+SVytboyFrNXZsXCREne6gzQNU/n3dSTTEGObFJbadss3YA\n2hb1iY4pm5dW3AdOc8oLNJkD98Zsj67lAqSGkydoKIkLRk1Gu0C7eeL4v8VE6G5A\nAwm6guFQnkCnM2ueE56o\n`.replace(/\\n/g, '\n'); // From JSON key
const FOLDER_ID = '1LMI4vH9L4Fu6JhaPuyR1jJ68gplSVmqC'; // ID of the shared folder

async function getAccessToken() {
    const jwtHeader = {
        alg: "RS256",
        typ: "JWT"
    };

    const jwtClaimSet = {
        iss: SERVICE_ACCOUNT_EMAIL,
        scope: "https://www.googleapis.com/auth/drive.file",
        aud: "https://oauth2.googleapis.com/token",
        exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiry
        iat: Math.floor(Date.now() / 1000)
    };

    const base64Encode = (obj) =>
        btoa(JSON.stringify(obj))
            .replace(/=/g, "")
            .replace(/\+/g, "-")
            .replace(/\//g, "_");

    const encodeHeader = base64Encode(jwtHeader);
    const encodeClaimSet = base64Encode(jwtClaimSet);

    const unsignedToken = `${encodeHeader}.${encodeClaimSet}`;

    // Use the Web Crypto API to sign the token
    const key = await crypto.subtle.importKey(
        "pkcs8",
        Uint8Array.from(atob(PRIVATE_KEY), (c) => c.charCodeAt(0)),
        { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
        false,
        ["sign"]
    );

    const signature = await crypto.subtle.sign(
        "RSASSA-PKCS1-v1_5",
        key,
        new TextEncoder().encode(unsignedToken)
    );

    const signedToken = `${unsignedToken}.${btoa(
        String.fromCharCode(...new Uint8Array(signature))
    )}`;

    const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
            assertion: signedToken
        })
    });

    const data = await response.json();
    return data.access_token;
}

async function uploadFile(accessToken, file) {
    const metadata = {
        name: file.name,
        parents: [FOLDER_ID]
    };

    const form = new FormData();
    form.append(
        "metadata",
        new Blob([JSON.stringify(metadata)], { type: "application/json" })
    );
    form.append("file", file);

    const response = await fetch(
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
        {
            method: "POST",
            headers: new Headers({ Authorization: `Bearer ${accessToken}` }),
            body: form
        }
    );

    if (response.ok) {
        const data = await response.json();
        alert(`File uploaded successfully! File ID: ${data.id}`);
    } else {
        alert("Failed to upload file");
        console.error(await response.text());
    }
}

document.getElementById("file").addEventListener("change", function(event)
{
    file = event.target.files[0];
    
    if (file) {
        file_name = file.name;
        file_size = file.size;
        
        document.getElementById("file-name").textContent = file_name;
        
        if (file_size < 1000)
            document.getElementById("file-size").textContent = file_size + " Bi";
        else if (file_size < 1e4)
            document.getElementById("file-size").textContent =
                Math.floor(file_size / 1000) + "," + (file_size % 1000).toString().padStart(3, "0") + " Bi";
        else if (file_size < 1024 ** 2)
            document.getElementById("file-size").textContent = (file_size / 1024).toFixed(3) + " KBi";
        else if (file_size < 1024 ** 3)
            document.getElementById("file-size").textContent = (file_size / 1024 ** 2).toFixed(3) + " MBi";
        else if (file_size < 1024 ** 4)
            document.getElementById("file-size").textContent = (file_size / 1024 ** 3).toFixed(3) + " MBi";
        
        const reader = new FileReader();
        
        reader.onload = e => {
            const uint8Array = new Uint8Array(e.target.result);
            
            file_data = Array.from(uint8Array).map(byte => String.fromCharCode(byte)).join('');
            
            console.log(file_data);
        };
        
        reader.readAsArrayBuffer(file);
    } else {
        document.getElementById("file-name").textContent = "No file selected."
    };
});

document.getElementById("upload").addEventListener("click", async () => {
    const fileInput = document.getElementById("file");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a file to upload");
        return;
    }

    try {
        const accessToken = await getAccessToken();
        await uploadFile(accessToken, file);
    } catch (error) {
        console.error("Error:", error);
    }
});