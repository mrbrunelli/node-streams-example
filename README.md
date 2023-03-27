## readFile vs createReadStream

A diferença entre fs.readFile e createReadStream em Node.js é que fs.readFile lê o arquivo inteiro na memória de uma vez, enquanto createReadStream lê o arquivo em pedaços do tamanho que você especificar.

Isso significa que createReadStream pode ser mais eficiente para arquivos grandes, pois economiza memória e envia os dados mais rápido para o cliente.

Além disso, createReadStream permite usar o método pipe() para conectar o fluxo de leitura com outro fluxo de escrita, como uma resposta HTTP. Por outro lado, fs.readFile é assíncrono e pode ser promisificado, o que facilita a escrita e a leitura do código.
