<script lang="ts">
    export let abis
    export let transaction

    console.log({ abis, transaction })

    if (!abis || !transaction) {
        throw new Error('RicardianContract - Missing ABI or transaction')
    }

    import ricardianTemplate from '../../../../../assets/ricardian-contracts/index.html?raw'

    console.log({ ricardianTemplate })

    const ricardianScript =  `
      var contractContainer = document.getElementById("contract-container");

      var factory = new ContractTemplateToolkit.RicardianContractFactory();
      var config = {
        abi: ${JSON.stringify(abis)},
        transaction: ${JSON.stringify(transaction)},
        actionIndex: 0,
        maxPasses: 3,
        allowUnusedVariables: false,
      };
      var ricardianContract = factory.create(config);
      var html = ricardianContract.getHtml();

      contractContainer.innerHTML = html;
    `



    console.log({ ricardianScript })

    const ricardianTemplateParts = ricardianTemplate.split("/script>")

    console.log({ ricardianTemplateParts })

    const ricardianTemplateWithScript = `${ricardianTemplateParts[0]}/script>\n<script>${ricardianScript}\n<` + `/script>\n${ricardianTemplateParts[1]}`
</script>

<style lang="scss">
  div {
    width: 100%;

    iframe {
      max-width: 500px;
      width: 80%;
      margin: 20px auto;
      min-height: 300px;
    }
  }
</style>

<div>
    <iframe srcdoc={ricardianTemplateWithScript} />
</div>