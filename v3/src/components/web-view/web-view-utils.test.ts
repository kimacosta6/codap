import { kRelativePluginRoot, kRootPluginUrl, processPluginUrl } from "./web-view-utils"

describe('WebView Utilities', () => {
  it('processPluginUrl works', () => {
    const url1 = `https://test/`
    const processedUrl1 = `${url1}index.html`
    expect(processPluginUrl(url1)).toEqual(processedUrl1)

    const url2 = `${kRelativePluginRoot}/index.html`
    const processedUrl2 = `${kRootPluginUrl}/index.html`
    expect(processPluginUrl(url2)).toEqual(processedUrl2)

    const url3 = `http://index.html`
    const processedUrl3 = `https://index.html`
    expect(processPluginUrl(url3)).toEqual(processedUrl3)
  })
})
