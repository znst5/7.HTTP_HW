const createRequest = async (options = {}) => {
    const { url, method = 'GET', data, callback } = options;
    const baseUrl = url && url !== 'undefined' ? url : 'http://localhost:7070';
    const xhr = new XMLHttpRequest();

    try {
        let finalUrl = baseUrl;
        if (method === "GET" && data) {
            const params = new URLSearchParams(data).toString();
            finalUrl += `?${params}`;
        }
        xhr.open(method, finalUrl);

        if (method === "POST") {
            xhr.setRequestHeader('Content-Type', 'application/json');
        }
        xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                if (xhr.status === 204) {
                    callback(null, true);
                } else {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        callback(null, response);
                    } catch (e) {
                        callback(null, xhr.responseText);
                    }
                }
            } else {
                callback(new Error(`Ошибка сервера: ${xhr.status}`));
            }
        });

        xhr.addEventListener('error', () => {
            callback(new Error('Сетевая ошибка при запросе'));
        });

        if (method === "POST" && data) {
            xhr.send(JSON.stringify(data));
        } else {
            xhr.send();
        }
    } catch (error) {
        callback(error);
    }
};

export default createRequest;
