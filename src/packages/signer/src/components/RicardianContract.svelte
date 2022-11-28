<script lang="ts">
    import ricardianTemplate from '@assets/ricardian-contracts/index.html?raw'

    export let action
    export let abi
    export let transaction

    if (!action || !abi || !transaction) {
        throw new Error('RicardianContract - Missing action, ABI or transaction')
    }

    const relevantTransaction = {
        ...transaction,
        actions: [
            {
                ...action,
                data: action.decodeData(abi),
            },
        ],
    }

    const ricardianScript = `
      var contractContainer = document.getElementById("contract-container");
      var factory = new ContractTemplateToolkit.RicardianContractFactory();

      var config = {
        abi: ${JSON.stringify(abi)},
        transaction: ${JSON.stringify(relevantTransaction)},
        actionIndex: 0,
        maxPasses: 3,
        allowUnusedVariables: false,
      };

      var ricardianContract = factory.create(config);
      var html = ricardianContract.getHtml();

      contractContainer.innerHTML = html;
    `

    const ricardianTemplateParts = ricardianTemplate.split('/body>')

    const ricardianTemplateWithScript =
        `${ricardianTemplateParts[0]}/body>\n<script>${ricardianScript}\n<` +
        `/script>\n${ricardianTemplateParts[1]}`
</script>

<style lang="scss">
    div {
        width: 100%;

        iframe {
            max-width: 500px;
            width: 80%;
            margin: 0 auto 20px auto;
            min-height: 300px;
        }
    }
</style>

<div>
    <h3>{`${action.account} - ${action.name}`}</h3>

    <iframe title="" srcdoc={ricardianTemplateWithScript} sandbox="allow-scripts" />
</div>
