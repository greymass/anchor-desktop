<script lang="ts">
    import ricardianTemplate from '@assets/ricardian-contracts/index.html?raw'

    export let action
    export let abi
    export let index: number
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

    const onloadScript = `window.top.postMessage({ height: document.body.scrollHeight, iframe: 'iframe-${index}' }, '*');`

    const ricardianTemplateParts = ricardianTemplate.split('/body>')

    const ricardianTemplateWithScript =
        `${ricardianTemplateParts[0]}/body>\n<script>${ricardianScript}\n${onloadScript}\n<` +
        `/script>\n${ricardianTemplateParts[1]}`

    let iframe: HTMLIFrameElement

    window.addEventListener(
        'message',
        function (e) {
            let message = e.data
            if (message.iframe === `iframe-${index}` && message.height > 0) {
                iframe.style.height = message.height + 'px'
            }
        },
        false
    )
</script>

<style lang="scss">
    iframe {
        border: 0;
        margin: 0;
        height: 0;
        width: 100vw;
    }
</style>

<iframe
    bind:this={iframe}
    scrolling="no"
    title={`iframe-${index}`}
    srcdoc={ricardianTemplateWithScript}
    sandbox="allow-scripts"
/>
