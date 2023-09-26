let totalNotasFiscaisLidas = 0;
const codigosDeBarrasLidos = new Map();
const dataHoraAtualInput = document.getElementById("dataHoraAtual");
const transportadoraInput = document.getElementById("transportadora");
const tabelaNFs = document.getElementById("tabelaNFs");

function atualizarDataHoraAtual() {
  const dataHora = new Date();
  dataHoraAtualInput.value = dataHora.toLocaleString();
}

atualizarDataHoraAtual();

function lerCodigoDeBarras() {
  const codigoDeBarrasInput = document.getElementById("codigoDeBarras");
  const codigoLido = codigoDeBarrasInput.value.trim();
  const transportadora = transportadoraInput.value.trim();

  if (transportadora === "") {
    alert(
      'Por favor, preencha o campo "Nome da Transportadora" antes de escanear o código de barras.'
    );
    return;
  }

  if (codigoLido) {
    const numeroVolume = codigosDeBarrasLidos.has(codigoLido)
      ? codigosDeBarrasLidos.get(codigoLido) + 1
      : 1;
    const confirmarInsercao = codigosDeBarrasLidos.has(codigoLido)
      ? confirm(
          `Este código de barras já foi lido anteriormente. Deseja inseri-lo como o Volume ${numeroVolume}?`
        )
      : true;

    if (confirmarInsercao) {
      const row = tabelaNFs.insertRow(0);
      row.insertCell(0).textContent = codigoLido;
      row.insertCell(1).textContent = transportadora;
      row.insertCell(2).textContent = numeroVolume;
      const removeButton = document.createElement("button");
      removeButton.textContent = "Remover";
      removeButton.onclick = () => removerCodigoDeBarras(codigoLido);
      row.insertCell(3).appendChild(removeButton);

      codigosDeBarrasLidos.set(codigoLido, numeroVolume);

      codigoDeBarrasInput.value = "";

      totalNotasFiscaisLidas++;
      document.getElementById("totalNotasFiscais").textContent =
        totalNotasFiscaisLidas;
    } else {
      codigoDeBarrasInput.value = "";
    }
  }
}

function exportarParaXLS() {
  const dadosColunas = [
    ["Código de Barras da NF", "Transportadora", "Volumes"],
  ];

  for (const [codigoLido, numeroVolume] of codigosDeBarrasLidos) {
    const transportadora = transportadoraInput.value.trim();
    dadosColunas.push([codigoLido, transportadora, numeroVolume]);
  }

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(dadosColunas);
  XLSX.utils.book_append_sheet(wb, ws, "Notas Fiscais");

  // Obtém a data e hora atual
  const dataHoraAtual = new Date()
    .toLocaleString()
    .replace(/[/\\:*?"<>|]/g, ""); // Remove caracteres inválidos para nome de arquivo

  // Obtém o nome da transportadora
  const nomeTransportadora = transportadoraInput.value.trim();

  // Define o nome do arquivo
  const nomeArquivo = `${nomeTransportadora}_${
    dataHoraAtual.split(",")[0]
  }.xlsx`; // Remove o horário

  XLSX.writeFile(wb, nomeArquivo);
}

function exportarParaPDF() {
  // Função para exportar para PDF (mantida igual)
}

function removerCodigoDeBarras(codigoLido) {
  const rows = tabelaNFs.getElementsByTagName("tr");

  for (let i = 0; i < rows.length; i++) {
    const codigoBarrasNF = rows[i].cells[0].textContent;

    if (codigoBarrasNF === codigoLido) {
      tabelaNFs.deleteRow(i);
      codigosDeBarrasLidos.delete(codigoLido);
      totalNotasFiscaisLidas--;
      document.getElementById("totalNotasFiscais").textContent =
        totalNotasFiscaisLidas;
      break;
    }
  }
}
