const postData = async (url, data) => {
    const res = await fetch(url, {
        method: "POST",
        headers: {
            'Content-type': 'application/json' //заголовок запроса
        }, 
        body: data
    });

    return await res.json(); //возвращаем промис. сначала дожидаемся результата промиса,  а потом возвращаем его (return)
    // так как это асинхронный код, сначала будет выполняться fetch, а потом результат присваиваться переменной res. если обещание еще не выполнилось, то в перменную присвоится undefined и будет ошибка. нам нужно сделать асинхронный код синхронным (async) - мы указали, что код в функции будет асинхронным, await мы ставим перед операциями, которые надо дождаться
};

async function getResource(url) {
    let res = await fetch(url);

    if(!res.ok){
        throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    }


    return await res.json(); 
};

export {postData};
export {getResource};