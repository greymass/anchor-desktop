<script lang="ts">

    let abi
    let transaction

    const ricardianScript =  `
      var contractContainer = document.getElementById("contract-container");

      var factory = new ContractTemplateToolkit.RicardianContractFactory();
      var config = {
        abi: ${abi},
        transaction: ${transaction},
        actionIndex: 0,
        maxPasses: 3,
        allowUnusedVariables: false,
      };
      var ricardianContract = factory.create(config);
      var html = ricardianContract.getHtml();

      contractContainer.innerHTML = html;

      window.ReactNativeWebView.postMessage(document.body.scrollHeight);

      true; // note: this is required, or you'll sometimes get silent failures
    `
</script>

<div>
    <iframe src={ricardianPath} />
</div>