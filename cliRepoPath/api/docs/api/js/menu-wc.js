'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">nest-ebtheme documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="changelog.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>CHANGELOG
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AgoraModule.html" data-type="entity-link" >AgoraModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AgoraModule-32f1789fc68b93581c2aedcb7be8daf0d493de5c2f99635d81157f7e8b129c4845e83bb1fdb4f8ad23ef97c62db77e8f51b71868631b4d65915cbff0830dd8bc"' : 'data-bs-target="#xs-injectables-links-module-AgoraModule-32f1789fc68b93581c2aedcb7be8daf0d493de5c2f99635d81157f7e8b129c4845e83bb1fdb4f8ad23ef97c62db77e8f51b71868631b4d65915cbff0830dd8bc"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AgoraModule-32f1789fc68b93581c2aedcb7be8daf0d493de5c2f99635d81157f7e8b129c4845e83bb1fdb4f8ad23ef97c62db77e8f51b71868631b4d65915cbff0830dd8bc"' :
                                        'id="xs-injectables-links-module-AgoraModule-32f1789fc68b93581c2aedcb7be8daf0d493de5c2f99635d81157f7e8b129c4845e83bb1fdb4f8ad23ef97c62db77e8f51b71868631b4d65915cbff0830dd8bc"' }>
                                        <li class="link">
                                            <a href="injectables/AgoraService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AgoraService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AuthModule-d7c359ca44b0820ecb6bd825d983ffe77477e8ba7e7bfae656997ed78db7d4f5364de0bccaa730a35ef472962052cba6ee45a201e90995a3b16bb651bbf9ef77"' : 'data-bs-target="#xs-controllers-links-module-AuthModule-d7c359ca44b0820ecb6bd825d983ffe77477e8ba7e7bfae656997ed78db7d4f5364de0bccaa730a35ef472962052cba6ee45a201e90995a3b16bb651bbf9ef77"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-d7c359ca44b0820ecb6bd825d983ffe77477e8ba7e7bfae656997ed78db7d4f5364de0bccaa730a35ef472962052cba6ee45a201e90995a3b16bb651bbf9ef77"' :
                                            'id="xs-controllers-links-module-AuthModule-d7c359ca44b0820ecb6bd825d983ffe77477e8ba7e7bfae656997ed78db7d4f5364de0bccaa730a35ef472962052cba6ee45a201e90995a3b16bb651bbf9ef77"' }>
                                            <li class="link">
                                                <a href="controllers/AppleSingInController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppleSingInController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthModule-d7c359ca44b0820ecb6bd825d983ffe77477e8ba7e7bfae656997ed78db7d4f5364de0bccaa730a35ef472962052cba6ee45a201e90995a3b16bb651bbf9ef77"' : 'data-bs-target="#xs-injectables-links-module-AuthModule-d7c359ca44b0820ecb6bd825d983ffe77477e8ba7e7bfae656997ed78db7d4f5364de0bccaa730a35ef472962052cba6ee45a201e90995a3b16bb651bbf9ef77"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-d7c359ca44b0820ecb6bd825d983ffe77477e8ba7e7bfae656997ed78db7d4f5364de0bccaa730a35ef472962052cba6ee45a201e90995a3b16bb651bbf9ef77"' :
                                        'id="xs-injectables-links-module-AuthModule-d7c359ca44b0820ecb6bd825d983ffe77477e8ba7e7bfae656997ed78db7d4f5364de0bccaa730a35ef472962052cba6ee45a201e90995a3b16bb651bbf9ef77"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PhoneOtpAuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PhoneOtpAuthService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ChimeModule.html" data-type="entity-link" >ChimeModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ChimeModule-12b7061237469535af2ca7915ca8c327d6b1d931b1c73bd2a5974ed7c3c6ed51717997d467e7e0a203a4b6e4ba862c7ddd6697375480bab05734239ada0fc222"' : 'data-bs-target="#xs-injectables-links-module-ChimeModule-12b7061237469535af2ca7915ca8c327d6b1d931b1c73bd2a5974ed7c3c6ed51717997d467e7e0a203a4b6e4ba862c7ddd6697375480bab05734239ada0fc222"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ChimeModule-12b7061237469535af2ca7915ca8c327d6b1d931b1c73bd2a5974ed7c3c6ed51717997d467e7e0a203a4b6e4ba862c7ddd6697375480bab05734239ada0fc222"' :
                                        'id="xs-injectables-links-module-ChimeModule-12b7061237469535af2ca7915ca8c327d6b1d931b1c73bd2a5974ed7c3c6ed51717997d467e7e0a203a4b6e4ba862c7ddd6697375480bab05734239ada0fc222"' }>
                                        <li class="link">
                                            <a href="injectables/ChimeService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChimeService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CoinManagementModule.html" data-type="entity-link" >CoinManagementModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-CoinManagementModule-0ecd5b3d8e6fbd2842e3f84e1560a85b61e3a93f13735a61c6f5b01051ed56b6ba8a6abfdd337036a4a6cdf6f1fffc35be4b0b91872a70bf76bb94d631b0377e"' : 'data-bs-target="#xs-injectables-links-module-CoinManagementModule-0ecd5b3d8e6fbd2842e3f84e1560a85b61e3a93f13735a61c6f5b01051ed56b6ba8a6abfdd337036a4a6cdf6f1fffc35be4b0b91872a70bf76bb94d631b0377e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CoinManagementModule-0ecd5b3d8e6fbd2842e3f84e1560a85b61e3a93f13735a61c6f5b01051ed56b6ba8a6abfdd337036a4a6cdf6f1fffc35be4b0b91872a70bf76bb94d631b0377e"' :
                                        'id="xs-injectables-links-module-CoinManagementModule-0ecd5b3d8e6fbd2842e3f84e1560a85b61e3a93f13735a61c6f5b01051ed56b6ba8a6abfdd337036a4a6cdf6f1fffc35be4b0b91872a70bf76bb94d631b0377e"' }>
                                        <li class="link">
                                            <a href="injectables/CoinManagementService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CoinManagementService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CometChatModule.html" data-type="entity-link" >CometChatModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-CometChatModule-a53fdc58b372bc2d91d92bbb5888d309545af182bfca24be7a6a01a134a134cb493eb14f54e3cee82fe09cdd5892a3802a7424fd5384d6edddb53cbdf3a5af14"' : 'data-bs-target="#xs-controllers-links-module-CometChatModule-a53fdc58b372bc2d91d92bbb5888d309545af182bfca24be7a6a01a134a134cb493eb14f54e3cee82fe09cdd5892a3802a7424fd5384d6edddb53cbdf3a5af14"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-CometChatModule-a53fdc58b372bc2d91d92bbb5888d309545af182bfca24be7a6a01a134a134cb493eb14f54e3cee82fe09cdd5892a3802a7424fd5384d6edddb53cbdf3a5af14"' :
                                            'id="xs-controllers-links-module-CometChatModule-a53fdc58b372bc2d91d92bbb5888d309545af182bfca24be7a6a01a134a134cb493eb14f54e3cee82fe09cdd5892a3802a7424fd5384d6edddb53cbdf3a5af14"' }>
                                            <li class="link">
                                                <a href="controllers/CometChatController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CometChatController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-CometChatModule-a53fdc58b372bc2d91d92bbb5888d309545af182bfca24be7a6a01a134a134cb493eb14f54e3cee82fe09cdd5892a3802a7424fd5384d6edddb53cbdf3a5af14"' : 'data-bs-target="#xs-injectables-links-module-CometChatModule-a53fdc58b372bc2d91d92bbb5888d309545af182bfca24be7a6a01a134a134cb493eb14f54e3cee82fe09cdd5892a3802a7424fd5384d6edddb53cbdf3a5af14"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CometChatModule-a53fdc58b372bc2d91d92bbb5888d309545af182bfca24be7a6a01a134a134cb493eb14f54e3cee82fe09cdd5892a3802a7424fd5384d6edddb53cbdf3a5af14"' :
                                        'id="xs-injectables-links-module-CometChatModule-a53fdc58b372bc2d91d92bbb5888d309545af182bfca24be7a6a01a134a134cb493eb14f54e3cee82fe09cdd5892a3802a7424fd5384d6edddb53cbdf3a5af14"' }>
                                        <li class="link">
                                            <a href="injectables/CometChatService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CometChatService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ConfigProvider.html" data-type="entity-link" >ConfigProvider</a>
                            </li>
                            <li class="link">
                                <a href="modules/ContactsModule.html" data-type="entity-link" >ContactsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ContactsModule-dd620d8bfeed6b8c30af1c19018b027d637f3de0a27ee7d2a73e49d2880328004d3baa7617080f7e5c971c444796fcdbc1c4607f92fc66b8bbfc021945d8c8ac"' : 'data-bs-target="#xs-controllers-links-module-ContactsModule-dd620d8bfeed6b8c30af1c19018b027d637f3de0a27ee7d2a73e49d2880328004d3baa7617080f7e5c971c444796fcdbc1c4607f92fc66b8bbfc021945d8c8ac"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ContactsModule-dd620d8bfeed6b8c30af1c19018b027d637f3de0a27ee7d2a73e49d2880328004d3baa7617080f7e5c971c444796fcdbc1c4607f92fc66b8bbfc021945d8c8ac"' :
                                            'id="xs-controllers-links-module-ContactsModule-dd620d8bfeed6b8c30af1c19018b027d637f3de0a27ee7d2a73e49d2880328004d3baa7617080f7e5c971c444796fcdbc1c4607f92fc66b8bbfc021945d8c8ac"' }>
                                            <li class="link">
                                                <a href="controllers/ContactsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ContactsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ContactsModule-dd620d8bfeed6b8c30af1c19018b027d637f3de0a27ee7d2a73e49d2880328004d3baa7617080f7e5c971c444796fcdbc1c4607f92fc66b8bbfc021945d8c8ac"' : 'data-bs-target="#xs-injectables-links-module-ContactsModule-dd620d8bfeed6b8c30af1c19018b027d637f3de0a27ee7d2a73e49d2880328004d3baa7617080f7e5c971c444796fcdbc1c4607f92fc66b8bbfc021945d8c8ac"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ContactsModule-dd620d8bfeed6b8c30af1c19018b027d637f3de0a27ee7d2a73e49d2880328004d3baa7617080f7e5c971c444796fcdbc1c4607f92fc66b8bbfc021945d8c8ac"' :
                                        'id="xs-injectables-links-module-ContactsModule-dd620d8bfeed6b8c30af1c19018b027d637f3de0a27ee7d2a73e49d2880328004d3baa7617080f7e5c971c444796fcdbc1c4607f92fc66b8bbfc021945d8c8ac"' }>
                                        <li class="link">
                                            <a href="injectables/ContactsQueueProcessor.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ContactsQueueProcessor</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ContactsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ContactsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CronModule.html" data-type="entity-link" >CronModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-CronModule-62c2f8dae6266c02d04717d38a74c53e1f7b4e0a46432f3d34aef75a4737de0a9238e3e3452b898284c8b9bf1e014fa6f5c47d6190154ffdf026fcb0db2304a6"' : 'data-bs-target="#xs-injectables-links-module-CronModule-62c2f8dae6266c02d04717d38a74c53e1f7b4e0a46432f3d34aef75a4737de0a9238e3e3452b898284c8b9bf1e014fa6f5c47d6190154ffdf026fcb0db2304a6"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CronModule-62c2f8dae6266c02d04717d38a74c53e1f7b4e0a46432f3d34aef75a4737de0a9238e3e3452b898284c8b9bf1e014fa6f5c47d6190154ffdf026fcb0db2304a6"' :
                                        'id="xs-injectables-links-module-CronModule-62c2f8dae6266c02d04717d38a74c53e1f7b4e0a46432f3d34aef75a4737de0a9238e3e3452b898284c8b9bf1e014fa6f5c47d6190154ffdf026fcb0db2304a6"' }>
                                        <li class="link">
                                            <a href="injectables/CronService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CronService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/DisposableEmailService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DisposableEmailService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CronProvider.html" data-type="entity-link" >CronProvider</a>
                            </li>
                            <li class="link">
                                <a href="modules/DatabaseProvider.html" data-type="entity-link" >DatabaseProvider</a>
                            </li>
                            <li class="link">
                                <a href="modules/FakeApiModule.html" data-type="entity-link" >FakeApiModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/FaqModule.html" data-type="entity-link" >FaqModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-FaqModule-4f33b4084abdcc951a1ece35d936493a1a612489f0357fd8226dee1d6111b99a550bcbb50f0d7a869e5aaf4460706886d440249a12af975aff7afac1d8cc6285"' : 'data-bs-target="#xs-injectables-links-module-FaqModule-4f33b4084abdcc951a1ece35d936493a1a612489f0357fd8226dee1d6111b99a550bcbb50f0d7a869e5aaf4460706886d440249a12af975aff7afac1d8cc6285"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-FaqModule-4f33b4084abdcc951a1ece35d936493a1a612489f0357fd8226dee1d6111b99a550bcbb50f0d7a869e5aaf4460706886d440249a12af975aff7afac1d8cc6285"' :
                                        'id="xs-injectables-links-module-FaqModule-4f33b4084abdcc951a1ece35d936493a1a612489f0357fd8226dee1d6111b99a550bcbb50f0d7a869e5aaf4460706886d440249a12af975aff7afac1d8cc6285"' }>
                                        <li class="link">
                                            <a href="injectables/FAQService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FAQService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/FeedCommentsModule.html" data-type="entity-link" >FeedCommentsModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-FeedCommentsModule-de38858c5b64c58db348b470ed52636f9e9f9abd3d6f457933a44f973dc0e491f69c0837b0296cc28c93c45610d50781915309bb0614042b92f68734022e8fc6"' : 'data-bs-target="#xs-injectables-links-module-FeedCommentsModule-de38858c5b64c58db348b470ed52636f9e9f9abd3d6f457933a44f973dc0e491f69c0837b0296cc28c93c45610d50781915309bb0614042b92f68734022e8fc6"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-FeedCommentsModule-de38858c5b64c58db348b470ed52636f9e9f9abd3d6f457933a44f973dc0e491f69c0837b0296cc28c93c45610d50781915309bb0614042b92f68734022e8fc6"' :
                                        'id="xs-injectables-links-module-FeedCommentsModule-de38858c5b64c58db348b470ed52636f9e9f9abd3d6f457933a44f973dc0e491f69c0837b0296cc28c93c45610d50781915309bb0614042b92f68734022e8fc6"' }>
                                        <li class="link">
                                            <a href="injectables/FeedCommentNotificationHandler.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FeedCommentNotificationHandler</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/FeedCommentsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FeedCommentsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/FeedRepliesService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FeedRepliesService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/FeedRepliesModule.html" data-type="entity-link" >FeedRepliesModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-FeedRepliesModule-96506f88ec6051495b47811cfaa57878de0a482e169ba5c63e6407179b3c38c38a3c03726aaab8e66d776c22b89d29f79a915bc4449e248ef97c1ced00e656a8"' : 'data-bs-target="#xs-injectables-links-module-FeedRepliesModule-96506f88ec6051495b47811cfaa57878de0a482e169ba5c63e6407179b3c38c38a3c03726aaab8e66d776c22b89d29f79a915bc4449e248ef97c1ced00e656a8"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-FeedRepliesModule-96506f88ec6051495b47811cfaa57878de0a482e169ba5c63e6407179b3c38c38a3c03726aaab8e66d776c22b89d29f79a915bc4449e248ef97c1ced00e656a8"' :
                                        'id="xs-injectables-links-module-FeedRepliesModule-96506f88ec6051495b47811cfaa57878de0a482e169ba5c63e6407179b3c38c38a3c03726aaab8e66d776c22b89d29f79a915bc4449e248ef97c1ced00e656a8"' }>
                                        <li class="link">
                                            <a href="injectables/FeedRepliesService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FeedRepliesService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/FeedsModule.html" data-type="entity-link" >FeedsModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-FeedsModule-798d6773e6ecc2e75166a81fbed6fec412880a6fa5467fb80688b20b91cf8208f8035fb050974dd60f009361c8429f1a6c6b088f4d60cc121fe17af577fe73c9"' : 'data-bs-target="#xs-injectables-links-module-FeedsModule-798d6773e6ecc2e75166a81fbed6fec412880a6fa5467fb80688b20b91cf8208f8035fb050974dd60f009361c8429f1a6c6b088f4d60cc121fe17af577fe73c9"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-FeedsModule-798d6773e6ecc2e75166a81fbed6fec412880a6fa5467fb80688b20b91cf8208f8035fb050974dd60f009361c8429f1a6c6b088f4d60cc121fe17af577fe73c9"' :
                                        'id="xs-injectables-links-module-FeedsModule-798d6773e6ecc2e75166a81fbed6fec412880a6fa5467fb80688b20b91cf8208f8035fb050974dd60f009361c8429f1a6c6b088f4d60cc121fe17af577fe73c9"' }>
                                        <li class="link">
                                            <a href="injectables/FeedCommentNotificationHandler.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FeedCommentNotificationHandler</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/FeedCommentsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FeedCommentsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/FeedsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FeedsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/NotificationsModule.html" data-type="entity-link" >NotificationsModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-NotificationsModule-f5dc3d6b51140962376d454b38c72ea959856bd1690649cb1e561ed850fbfa18f35c681da000da4c2483202484f4f1412dd0aba74260df03bbc95d6cdb624828"' : 'data-bs-target="#xs-injectables-links-module-NotificationsModule-f5dc3d6b51140962376d454b38c72ea959856bd1690649cb1e561ed850fbfa18f35c681da000da4c2483202484f4f1412dd0aba74260df03bbc95d6cdb624828"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-NotificationsModule-f5dc3d6b51140962376d454b38c72ea959856bd1690649cb1e561ed850fbfa18f35c681da000da4c2483202484f4f1412dd0aba74260df03bbc95d6cdb624828"' :
                                        'id="xs-injectables-links-module-NotificationsModule-f5dc3d6b51140962376d454b38c72ea959856bd1690649cb1e561ed850fbfa18f35c681da000da4c2483202484f4f1412dd0aba74260df03bbc95d6cdb624828"' }>
                                        <li class="link">
                                            <a href="injectables/NotificationsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NotificationsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/PagesModule.html" data-type="entity-link" >PagesModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-PagesModule-8bf7e618afc3181a20404a46d67341e497032167f301bd638078a2bc9198d409b72c7825eca29df138b4552c244535f3c8d3c88d955a9d3289e7751919054938"' : 'data-bs-target="#xs-injectables-links-module-PagesModule-8bf7e618afc3181a20404a46d67341e497032167f301bd638078a2bc9198d409b72c7825eca29df138b4552c244535f3c8d3c88d955a9d3289e7751919054938"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-PagesModule-8bf7e618afc3181a20404a46d67341e497032167f301bd638078a2bc9198d409b72c7825eca29df138b4552c244535f3c8d3c88d955a9d3289e7751919054938"' :
                                        'id="xs-injectables-links-module-PagesModule-8bf7e618afc3181a20404a46d67341e497032167f301bd638078a2bc9198d409b72c7825eca29df138b4552c244535f3c8d3c88d955a9d3289e7751919054938"' }>
                                        <li class="link">
                                            <a href="injectables/PagesService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PagesService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/PermissionModule.html" data-type="entity-link" >PermissionModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/RapidIdModule.html" data-type="entity-link" >RapidIdModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-RapidIdModule-65fd44b4031a8c10b2b32abfb54152d93f3b62b4a8175b586ccdcfe703d1239023a97edf342952d6834764d79462fe330501d7de734dfb92a701cdcb9b8a9e69"' : 'data-bs-target="#xs-injectables-links-module-RapidIdModule-65fd44b4031a8c10b2b32abfb54152d93f3b62b4a8175b586ccdcfe703d1239023a97edf342952d6834764d79462fe330501d7de734dfb92a701cdcb9b8a9e69"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-RapidIdModule-65fd44b4031a8c10b2b32abfb54152d93f3b62b4a8175b586ccdcfe703d1239023a97edf342952d6834764d79462fe330501d7de734dfb92a701cdcb9b8a9e69"' :
                                        'id="xs-injectables-links-module-RapidIdModule-65fd44b4031a8c10b2b32abfb54152d93f3b62b4a8175b586ccdcfe703d1239023a97edf342952d6834764d79462fe330501d7de734dfb92a701cdcb9b8a9e69"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PhoneOtpAuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PhoneOtpAuthService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SiteSettingsModule.html" data-type="entity-link" >SiteSettingsModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-SiteSettingsModule-51e5e16d88fce455499f5dc4de390ae4a53bdf804edfd09a218f8695f45d34fa1d89bfb0d7032d70abbbb84d70f3fe352e1d5f4cc654b2f746a1396f268a9a3e"' : 'data-bs-target="#xs-injectables-links-module-SiteSettingsModule-51e5e16d88fce455499f5dc4de390ae4a53bdf804edfd09a218f8695f45d34fa1d89bfb0d7032d70abbbb84d70f3fe352e1d5f4cc654b2f746a1396f268a9a3e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SiteSettingsModule-51e5e16d88fce455499f5dc4de390ae4a53bdf804edfd09a218f8695f45d34fa1d89bfb0d7032d70abbbb84d70f3fe352e1d5f4cc654b2f746a1396f268a9a3e"' :
                                        'id="xs-injectables-links-module-SiteSettingsModule-51e5e16d88fce455499f5dc4de390ae4a53bdf804edfd09a218f8695f45d34fa1d89bfb0d7032d70abbbb84d70f3fe352e1d5f4cc654b2f746a1396f268a9a3e"' }>
                                        <li class="link">
                                            <a href="injectables/SiteSettingsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SiteSettingsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/StripeConnectModule.html" data-type="entity-link" >StripeConnectModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-StripeConnectModule-5d8d098d73025da8094a79f02ce6628f4ca30ac69b26b45ae5c841fbe367ec1b4b8fed6aaf66f7f9145ed2358d46c729f0f4e666b97b7b541e1d3863be71e76b"' : 'data-bs-target="#xs-injectables-links-module-StripeConnectModule-5d8d098d73025da8094a79f02ce6628f4ca30ac69b26b45ae5c841fbe367ec1b4b8fed6aaf66f7f9145ed2358d46c729f0f4e666b97b7b541e1d3863be71e76b"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-StripeConnectModule-5d8d098d73025da8094a79f02ce6628f4ca30ac69b26b45ae5c841fbe367ec1b4b8fed6aaf66f7f9145ed2358d46c729f0f4e666b97b7b541e1d3863be71e76b"' :
                                        'id="xs-injectables-links-module-StripeConnectModule-5d8d098d73025da8094a79f02ce6628f4ca30ac69b26b45ae5c841fbe367ec1b4b8fed6aaf66f7f9145ed2358d46c729f0f4e666b97b7b541e1d3863be71e76b"' }>
                                        <li class="link">
                                            <a href="injectables/StripeConnectService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StripeConnectService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/StripePaymentModule.html" data-type="entity-link" >StripePaymentModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-StripePaymentModule-c1220193484644b66b79c118a8b6404c3cb3a80111f27de625738479750ce5c78c8ae37dfe70092f7aa04a1b4b3f527a4f54464a444b37baee0a2f39ebd6176e"' : 'data-bs-target="#xs-controllers-links-module-StripePaymentModule-c1220193484644b66b79c118a8b6404c3cb3a80111f27de625738479750ce5c78c8ae37dfe70092f7aa04a1b4b3f527a4f54464a444b37baee0a2f39ebd6176e"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-StripePaymentModule-c1220193484644b66b79c118a8b6404c3cb3a80111f27de625738479750ce5c78c8ae37dfe70092f7aa04a1b4b3f527a4f54464a444b37baee0a2f39ebd6176e"' :
                                            'id="xs-controllers-links-module-StripePaymentModule-c1220193484644b66b79c118a8b6404c3cb3a80111f27de625738479750ce5c78c8ae37dfe70092f7aa04a1b4b3f527a4f54464a444b37baee0a2f39ebd6176e"' }>
                                            <li class="link">
                                                <a href="controllers/StripePaymentWebhookController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StripePaymentWebhookController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-StripePaymentModule-c1220193484644b66b79c118a8b6404c3cb3a80111f27de625738479750ce5c78c8ae37dfe70092f7aa04a1b4b3f527a4f54464a444b37baee0a2f39ebd6176e"' : 'data-bs-target="#xs-injectables-links-module-StripePaymentModule-c1220193484644b66b79c118a8b6404c3cb3a80111f27de625738479750ce5c78c8ae37dfe70092f7aa04a1b4b3f527a4f54464a444b37baee0a2f39ebd6176e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-StripePaymentModule-c1220193484644b66b79c118a8b6404c3cb3a80111f27de625738479750ce5c78c8ae37dfe70092f7aa04a1b4b3f527a4f54464a444b37baee0a2f39ebd6176e"' :
                                        'id="xs-injectables-links-module-StripePaymentModule-c1220193484644b66b79c118a8b6404c3cb3a80111f27de625738479750ce5c78c8ae37dfe70092f7aa04a1b4b3f527a4f54464a444b37baee0a2f39ebd6176e"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PhoneOtpAuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PhoneOtpAuthService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/StripeSubscriptionModule.html" data-type="entity-link" >StripeSubscriptionModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-StripeSubscriptionModule-e83e5480ac5e472f14f1e44c1718fe807947c7ca8fa39acf9d6a6191738f2fc23d15a5cec6693dd5f6d287f01d5fa420da693e7b331ca0168e2c91c7d56106e9"' : 'data-bs-target="#xs-controllers-links-module-StripeSubscriptionModule-e83e5480ac5e472f14f1e44c1718fe807947c7ca8fa39acf9d6a6191738f2fc23d15a5cec6693dd5f6d287f01d5fa420da693e7b331ca0168e2c91c7d56106e9"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-StripeSubscriptionModule-e83e5480ac5e472f14f1e44c1718fe807947c7ca8fa39acf9d6a6191738f2fc23d15a5cec6693dd5f6d287f01d5fa420da693e7b331ca0168e2c91c7d56106e9"' :
                                            'id="xs-controllers-links-module-StripeSubscriptionModule-e83e5480ac5e472f14f1e44c1718fe807947c7ca8fa39acf9d6a6191738f2fc23d15a5cec6693dd5f6d287f01d5fa420da693e7b331ca0168e2c91c7d56106e9"' }>
                                            <li class="link">
                                                <a href="controllers/StripeSubscriptionWebhookController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StripeSubscriptionWebhookController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-StripeSubscriptionModule-e83e5480ac5e472f14f1e44c1718fe807947c7ca8fa39acf9d6a6191738f2fc23d15a5cec6693dd5f6d287f01d5fa420da693e7b331ca0168e2c91c7d56106e9"' : 'data-bs-target="#xs-injectables-links-module-StripeSubscriptionModule-e83e5480ac5e472f14f1e44c1718fe807947c7ca8fa39acf9d6a6191738f2fc23d15a5cec6693dd5f6d287f01d5fa420da693e7b331ca0168e2c91c7d56106e9"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-StripeSubscriptionModule-e83e5480ac5e472f14f1e44c1718fe807947c7ca8fa39acf9d6a6191738f2fc23d15a5cec6693dd5f6d287f01d5fa420da693e7b331ca0168e2c91c7d56106e9"' :
                                        'id="xs-injectables-links-module-StripeSubscriptionModule-e83e5480ac5e472f14f1e44c1718fe807947c7ca8fa39acf9d6a6191738f2fc23d15a5cec6693dd5f6d287f01d5fa420da693e7b331ca0168e2c91c7d56106e9"' }>
                                        <li class="link">
                                            <a href="injectables/StripeSubscriptionService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StripeSubscriptionService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/StripeSubscriptionWebhookService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StripeSubscriptionWebhookService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SubscriptionModule.html" data-type="entity-link" >SubscriptionModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-SubscriptionModule-cf8c2f3c2c1d5cfda66b1af71baf422c90f9d4d64c798bc0db8ebffde12e8da4491ae11958cc930e06542ebc5d8b130849a7ceaff0411bbbeddfc847c5d066d3"' : 'data-bs-target="#xs-controllers-links-module-SubscriptionModule-cf8c2f3c2c1d5cfda66b1af71baf422c90f9d4d64c798bc0db8ebffde12e8da4491ae11958cc930e06542ebc5d8b130849a7ceaff0411bbbeddfc847c5d066d3"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-SubscriptionModule-cf8c2f3c2c1d5cfda66b1af71baf422c90f9d4d64c798bc0db8ebffde12e8da4491ae11958cc930e06542ebc5d8b130849a7ceaff0411bbbeddfc847c5d066d3"' :
                                            'id="xs-controllers-links-module-SubscriptionModule-cf8c2f3c2c1d5cfda66b1af71baf422c90f9d4d64c798bc0db8ebffde12e8da4491ae11958cc930e06542ebc5d8b130849a7ceaff0411bbbeddfc847c5d066d3"' }>
                                            <li class="link">
                                                <a href="controllers/SubscriptionWebhookController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SubscriptionWebhookController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-SubscriptionModule-cf8c2f3c2c1d5cfda66b1af71baf422c90f9d4d64c798bc0db8ebffde12e8da4491ae11958cc930e06542ebc5d8b130849a7ceaff0411bbbeddfc847c5d066d3"' : 'data-bs-target="#xs-injectables-links-module-SubscriptionModule-cf8c2f3c2c1d5cfda66b1af71baf422c90f9d4d64c798bc0db8ebffde12e8da4491ae11958cc930e06542ebc5d8b130849a7ceaff0411bbbeddfc847c5d066d3"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SubscriptionModule-cf8c2f3c2c1d5cfda66b1af71baf422c90f9d4d64c798bc0db8ebffde12e8da4491ae11958cc930e06542ebc5d8b130849a7ceaff0411bbbeddfc847c5d066d3"' :
                                        'id="xs-injectables-links-module-SubscriptionModule-cf8c2f3c2c1d5cfda66b1af71baf422c90f9d4d64c798bc0db8ebffde12e8da4491ae11958cc930e06542ebc5d8b130849a7ceaff0411bbbeddfc847c5d066d3"' }>
                                        <li class="link">
                                            <a href="injectables/SubscriptionService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SubscriptionService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsersModule.html" data-type="entity-link" >UsersModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UsersModule-88f7f881ba01409c928d0d678ea114c86690bdf8de39f812daf74f7ba589a5b60278ab9fbb9cbd3ad5cdebabf11c968f03fe37c8d68a90a1f1853a0558298724"' : 'data-bs-target="#xs-injectables-links-module-UsersModule-88f7f881ba01409c928d0d678ea114c86690bdf8de39f812daf74f7ba589a5b60278ab9fbb9cbd3ad5cdebabf11c968f03fe37c8d68a90a1f1853a0558298724"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UsersModule-88f7f881ba01409c928d0d678ea114c86690bdf8de39f812daf74f7ba589a5b60278ab9fbb9cbd3ad5cdebabf11c968f03fe37c8d68a90a1f1853a0558298724"' :
                                        'id="xs-injectables-links-module-UsersModule-88f7f881ba01409c928d0d678ea114c86690bdf8de39f812daf74f7ba589a5b60278ab9fbb9cbd3ad5cdebabf11c968f03fe37c8d68a90a1f1853a0558298724"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PhoneOtpAuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PhoneOtpAuthService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#controllers-links"' :
                                'data-bs-target="#xs-controllers-links"' }>
                                <span class="icon ion-md-swap"></span>
                                <span>Controllers</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="controllers-links"' : 'id="xs-controllers-links"' }>
                                <li class="link">
                                    <a href="controllers/AppleSingInController.html" data-type="entity-link" >AppleSingInController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/StripePaymentWebhookController.html" data-type="entity-link" >StripePaymentWebhookController</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AddCoinPackageInput.html" data-type="entity-link" >AddCoinPackageInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddressInput.html" data-type="entity-link" >AddressInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/AgoraCallTokenResponse.html" data-type="entity-link" >AgoraCallTokenResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/AgoraChatUserTokenResponse.html" data-type="entity-link" >AgoraChatUserTokenResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/AgoraResolver.html" data-type="entity-link" >AgoraResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/AgoraTokenResponse.html" data-type="entity-link" >AgoraTokenResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/AndroidReceipt.html" data-type="entity-link" >AndroidReceipt</a>
                            </li>
                            <li class="link">
                                <a href="classes/AndroidReceiptConsumable.html" data-type="entity-link" >AndroidReceiptConsumable</a>
                            </li>
                            <li class="link">
                                <a href="classes/AnimalsListResponse.html" data-type="entity-link" >AnimalsListResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/AppleLoginInput.html" data-type="entity-link" >AppleLoginInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/AttendeeResponse.html" data-type="entity-link" >AttendeeResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthResolver.html" data-type="entity-link" >AuthResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/BankDetail.html" data-type="entity-link" >BankDetail</a>
                            </li>
                            <li class="link">
                                <a href="classes/BankDetailData.html" data-type="entity-link" >BankDetailData</a>
                            </li>
                            <li class="link">
                                <a href="classes/Banner.html" data-type="entity-link" >Banner</a>
                            </li>
                            <li class="link">
                                <a href="classes/BannerButton.html" data-type="entity-link" >BannerButton</a>
                            </li>
                            <li class="link">
                                <a href="classes/BasePaginationParams.html" data-type="entity-link" >BasePaginationParams</a>
                            </li>
                            <li class="link">
                                <a href="classes/BiometricEnableInput.html" data-type="entity-link" >BiometricEnableInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/BiometricEnableResponse.html" data-type="entity-link" >BiometricEnableResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/BiometricLoginInput.html" data-type="entity-link" >BiometricLoginInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/BiometricLoginResponse.html" data-type="entity-link" >BiometricLoginResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/Breed.html" data-type="entity-link" >Breed</a>
                            </li>
                            <li class="link">
                                <a href="classes/BreedListResponse.html" data-type="entity-link" >BreedListResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/Capabilities.html" data-type="entity-link" >Capabilities</a>
                            </li>
                            <li class="link">
                                <a href="classes/CardExpiryFormatConstraint.html" data-type="entity-link" >CardExpiryFormatConstraint</a>
                            </li>
                            <li class="link">
                                <a href="classes/CardListReponse.html" data-type="entity-link" >CardListReponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/ChangePasswordInput.html" data-type="entity-link" >ChangePasswordInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/ChimeResolver.html" data-type="entity-link" >ChimeResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/CoinManagementResolver.html" data-type="entity-link" >CoinManagementResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/CoinPackageResponse.html" data-type="entity-link" >CoinPackageResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/CometChatGroupResponse.html" data-type="entity-link" >CometChatGroupResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/CometChatResolver.html" data-type="entity-link" >CometChatResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/CommentAssetInput.html" data-type="entity-link" >CommentAssetInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CommentAssets.html" data-type="entity-link" >CommentAssets</a>
                            </li>
                            <li class="link">
                                <a href="classes/ConfigBiometricVariableService.html" data-type="entity-link" >ConfigBiometricVariableService</a>
                            </li>
                            <li class="link">
                                <a href="classes/ConfigVariableService.html" data-type="entity-link" >ConfigVariableService</a>
                            </li>
                            <li class="link">
                                <a href="classes/ContactDetailResponse.html" data-type="entity-link" >ContactDetailResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/ContactDetailsResponse.html" data-type="entity-link" >ContactDetailsResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/ContactResponse.html" data-type="entity-link" >ContactResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/ContactsListResponse.html" data-type="entity-link" >ContactsListResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/ContactsResolver.html" data-type="entity-link" >ContactsResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/Content.html" data-type="entity-link" >Content</a>
                            </li>
                            <li class="link">
                                <a href="classes/ContentType.html" data-type="entity-link" >ContentType</a>
                            </li>
                            <li class="link">
                                <a href="classes/CoordinatesInput.html" data-type="entity-link" >CoordinatesInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateAgoraInput.html" data-type="entity-link" >CreateAgoraInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateBankAccountInput.html" data-type="entity-link" >CreateBankAccountInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateBankAccountInput-1.html" data-type="entity-link" >CreateBankAccountInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateBankAccountLinkInput.html" data-type="entity-link" >CreateBankAccountLinkInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateBankAccountLinkInput-1.html" data-type="entity-link" >CreateBankAccountLinkInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateBankDetailInput.html" data-type="entity-link" >CreateBankDetailInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateBankDetailInput-1.html" data-type="entity-link" >CreateBankDetailInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateBankTokenInput.html" data-type="entity-link" >CreateBankTokenInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateBankTokenInput-1.html" data-type="entity-link" >CreateBankTokenInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateCardInput.html" data-type="entity-link" >CreateCardInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateCometChatGroupInput.html" data-type="entity-link" >CreateCometChatGroupInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateConnectAccountInput.html" data-type="entity-link" >CreateConnectAccountInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateConnectAccountInput-1.html" data-type="entity-link" >CreateConnectAccountInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateConnectAccountResponse.html" data-type="entity-link" >CreateConnectAccountResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateFAQDto.html" data-type="entity-link" >CreateFAQDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateFeedCommentInput.html" data-type="entity-link" >CreateFeedCommentInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateFeedInput.html" data-type="entity-link" >CreateFeedInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateFeedReplyInput.html" data-type="entity-link" >CreateFeedReplyInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateNotificationInput.html" data-type="entity-link" >CreateNotificationInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreatePaymentInput.html" data-type="entity-link" >CreatePaymentInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateStripeSubscriptionInput.html" data-type="entity-link" >CreateStripeSubscriptionInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserInput.html" data-type="entity-link" >CreateUserInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CronResolver.html" data-type="entity-link" >CronResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/CurrentSubscription.html" data-type="entity-link" >CurrentSubscription</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteCardInput.html" data-type="entity-link" >DeleteCardInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeletePaymentMethodInput.html" data-type="entity-link" >DeletePaymentMethodInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeviceInfoInput.html" data-type="entity-link" >DeviceInfoInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/DocsVerificationResponse.html" data-type="entity-link" >DocsVerificationResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/DriverLicenceVerificationInput.html" data-type="entity-link" >DriverLicenceVerificationInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/EmailSignupOTPInput.html" data-type="entity-link" >EmailSignupOTPInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/EphemeralKey.html" data-type="entity-link" >EphemeralKey</a>
                            </li>
                            <li class="link">
                                <a href="classes/EphemeralKeyResponse.html" data-type="entity-link" >EphemeralKeyResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExternalAccounts.html" data-type="entity-link" >ExternalAccounts</a>
                            </li>
                            <li class="link">
                                <a href="classes/FacebookLoginInput.html" data-type="entity-link" >FacebookLoginInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/FakeApiResolver.html" data-type="entity-link" >FakeApiResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/Faq.html" data-type="entity-link" >Faq</a>
                            </li>
                            <li class="link">
                                <a href="classes/FAQ.html" data-type="entity-link" >FAQ</a>
                            </li>
                            <li class="link">
                                <a href="classes/FaqResolver.html" data-type="entity-link" >FaqResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/FAQResponse.html" data-type="entity-link" >FAQResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/FAQsResponse.html" data-type="entity-link" >FAQsResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/FeedAsset.html" data-type="entity-link" >FeedAsset</a>
                            </li>
                            <li class="link">
                                <a href="classes/FeedAssetInput.html" data-type="entity-link" >FeedAssetInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/FeedCommentEntity.html" data-type="entity-link" >FeedCommentEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/FeedCommentResponse.html" data-type="entity-link" >FeedCommentResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/FeedCommentsResolver.html" data-type="entity-link" >FeedCommentsResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/FeedEntity.html" data-type="entity-link" >FeedEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/FeedRepliesResolver.html" data-type="entity-link" >FeedRepliesResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/FeedReplyEntity.html" data-type="entity-link" >FeedReplyEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/FeedReplyResponse.html" data-type="entity-link" >FeedReplyResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/FeedResponse.html" data-type="entity-link" >FeedResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/FeedsResolver.html" data-type="entity-link" >FeedsResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/FileResponse.html" data-type="entity-link" >FileResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/ForgotPasswordInput.html" data-type="entity-link" >ForgotPasswordInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/ForgotPasswordResponse.html" data-type="entity-link" >ForgotPasswordResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/ForgotPasswordVerificationExpiry.html" data-type="entity-link" >ForgotPasswordVerificationExpiry</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetCoinPackageInput.html" data-type="entity-link" >GetCoinPackageInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetEphemeralKeyInput.html" data-type="entity-link" >GetEphemeralKeyInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetFAQDto.html" data-type="entity-link" >GetFAQDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetListDTO.html" data-type="entity-link" >GetListDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/GoogleLoginInput.html" data-type="entity-link" >GoogleLoginInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/HowItWorksPage.html" data-type="entity-link" >HowItWorksPage</a>
                            </li>
                            <li class="link">
                                <a href="classes/HowItWorksSection.html" data-type="entity-link" >HowItWorksSection</a>
                            </li>
                            <li class="link">
                                <a href="classes/HttpExceptionFilter.html" data-type="entity-link" >HttpExceptionFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/IdentityDocument.html" data-type="entity-link" >IdentityDocument</a>
                            </li>
                            <li class="link">
                                <a href="classes/IdentityDocumentData.html" data-type="entity-link" >IdentityDocumentData</a>
                            </li>
                            <li class="link">
                                <a href="classes/ImageColumnPage.html" data-type="entity-link" >ImageColumnPage</a>
                            </li>
                            <li class="link">
                                <a href="classes/ImageColumnSection.html" data-type="entity-link" >ImageColumnSection</a>
                            </li>
                            <li class="link">
                                <a href="classes/InitiateAgoraCallInput.html" data-type="entity-link" >InitiateAgoraCallInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/InitiateMeetingInput.html" data-type="entity-link" >InitiateMeetingInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/InitiateMeetingResponse.html" data-type="entity-link" >InitiateMeetingResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/IosReceipt.html" data-type="entity-link" >IosReceipt</a>
                            </li>
                            <li class="link">
                                <a href="classes/IosReceiptConsumable.html" data-type="entity-link" >IosReceiptConsumable</a>
                            </li>
                            <li class="link">
                                <a href="classes/LinkBankAccountResponse.html" data-type="entity-link" >LinkBankAccountResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/ListCoinPackageResponse.html" data-type="entity-link" >ListCoinPackageResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/ListCommentsInFeedInput.html" data-type="entity-link" >ListCommentsInFeedInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/ListContactsDTO.html" data-type="entity-link" >ListContactsDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ListFeedsInput.html" data-type="entity-link" >ListFeedsInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/ListNotificationsInput.html" data-type="entity-link" >ListNotificationsInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/ListObject.html" data-type="entity-link" >ListObject</a>
                            </li>
                            <li class="link">
                                <a href="classes/ListRepliesInFeedInput.html" data-type="entity-link" >ListRepliesInFeedInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/ListUseProfilesDTO.html" data-type="entity-link" >ListUseProfilesDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/LocationInput.html" data-type="entity-link" >LocationInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/LocationRangeResponse.html" data-type="entity-link" >LocationRangeResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginEmailPasswordInput.html" data-type="entity-link" >LoginEmailPasswordInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginResponse.html" data-type="entity-link" >LoginResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginWithAppleResponse.html" data-type="entity-link" >LoginWithAppleResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginWithEmailResponse.html" data-type="entity-link" >LoginWithEmailResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginWithFacebookResponse.html" data-type="entity-link" >LoginWithFacebookResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginWithGoogleResponse.html" data-type="entity-link" >LoginWithGoogleResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginWithOTPInput.html" data-type="entity-link" >LoginWithOTPInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/LogoutInput.html" data-type="entity-link" >LogoutInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/MakePaymentMethodDefaultInput.html" data-type="entity-link" >MakePaymentMethodDefaultInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/MediaPlacement.html" data-type="entity-link" >MediaPlacement</a>
                            </li>
                            <li class="link">
                                <a href="classes/MedicareVerificationInput.html" data-type="entity-link" >MedicareVerificationInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/MeetingInput.html" data-type="entity-link" >MeetingInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/MeetingResponse.html" data-type="entity-link" >MeetingResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/NotificationResponse.html" data-type="entity-link" >NotificationResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/NotificationsResolver.html" data-type="entity-link" >NotificationsResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/NzDriverLicenceVerificationInput.html" data-type="entity-link" >NzDriverLicenceVerificationInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/NzPassportVerificationInput.html" data-type="entity-link" >NzPassportVerificationInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/OptionsResponse.html" data-type="entity-link" >OptionsResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/OTPResponse.html" data-type="entity-link" >OTPResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/Page.html" data-type="entity-link" >Page</a>
                            </li>
                            <li class="link">
                                <a href="classes/Page-1.html" data-type="entity-link" >Page</a>
                            </li>
                            <li class="link">
                                <a href="classes/PageResponse.html" data-type="entity-link" >PageResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/PageResponse-1.html" data-type="entity-link" >PageResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/PagesResolver.html" data-type="entity-link" >PagesResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/PaginatedNotifications.html" data-type="entity-link" >PaginatedNotifications</a>
                            </li>
                            <li class="link">
                                <a href="classes/PaginatedPaymentHistoryResponse.html" data-type="entity-link" >PaginatedPaymentHistoryResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/PassportVerificationInput.html" data-type="entity-link" >PassportVerificationInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/PaymentHistoryInput.html" data-type="entity-link" >PaymentHistoryInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/PaymentHistoryResponse.html" data-type="entity-link" >PaymentHistoryResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/PhoneLoginWithOTPInput.html" data-type="entity-link" >PhoneLoginWithOTPInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/PhoneNumberResponse.html" data-type="entity-link" >PhoneNumberResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/PriceResponse.html" data-type="entity-link" >PriceResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProfileUpdateResponse.html" data-type="entity-link" >ProfileUpdateResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/RapidIdResolver.html" data-type="entity-link" >RapidIdResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegisterResponse.html" data-type="entity-link" >RegisterResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/ReplyAssetInput.html" data-type="entity-link" >ReplyAssetInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/ReplyAssets.html" data-type="entity-link" >ReplyAssets</a>
                            </li>
                            <li class="link">
                                <a href="classes/RequestLoginOTPInput.html" data-type="entity-link" >RequestLoginOTPInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/RequestPhoneLoginOTPInput.html" data-type="entity-link" >RequestPhoneLoginOTPInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResetPasswordInput.html" data-type="entity-link" >ResetPasswordInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/SectionType.html" data-type="entity-link" >SectionType</a>
                            </li>
                            <li class="link">
                                <a href="classes/SeoTag.html" data-type="entity-link" >SeoTag</a>
                            </li>
                            <li class="link">
                                <a href="classes/SeoTag-1.html" data-type="entity-link" >SeoTag</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetPasswordInput.html" data-type="entity-link" >SetPasswordInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetupIntentResponse.html" data-type="entity-link" >SetupIntentResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/SignupInput.html" data-type="entity-link" >SignupInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/SiteSettingsResolver.html" data-type="entity-link" >SiteSettingsResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/SiteSettingsResponse.html" data-type="entity-link" >SiteSettingsResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/SocialLoginResponse.html" data-type="entity-link" >SocialLoginResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/StripeConnectAccountReponse.html" data-type="entity-link" >StripeConnectAccountReponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/StripeConnectResolver.html" data-type="entity-link" >StripeConnectResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/StripeCustomerReponseData.html" data-type="entity-link" >StripeCustomerReponseData</a>
                            </li>
                            <li class="link">
                                <a href="classes/StripePayment.html" data-type="entity-link" >StripePayment</a>
                            </li>
                            <li class="link">
                                <a href="classes/StripePaymentDetail.html" data-type="entity-link" >StripePaymentDetail</a>
                            </li>
                            <li class="link">
                                <a href="classes/StripePaymentDetailData.html" data-type="entity-link" >StripePaymentDetailData</a>
                            </li>
                            <li class="link">
                                <a href="classes/StripePaymentLog.html" data-type="entity-link" >StripePaymentLog</a>
                            </li>
                            <li class="link">
                                <a href="classes/StripePaymentResolver.html" data-type="entity-link" >StripePaymentResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/StripeSubscription.html" data-type="entity-link" >StripeSubscription</a>
                            </li>
                            <li class="link">
                                <a href="classes/StripeSubscriptionResolver.html" data-type="entity-link" >StripeSubscriptionResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/StripeSubscriptionResponse.html" data-type="entity-link" >StripeSubscriptionResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/SubscriptionObjectDto.html" data-type="entity-link" >SubscriptionObjectDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SubscriptionProductResponse.html" data-type="entity-link" >SubscriptionProductResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/SubscriptionResolver.html" data-type="entity-link" >SubscriptionResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/TermsAndConditionResponse.html" data-type="entity-link" >TermsAndConditionResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/ThemeAttributesEntity.html" data-type="entity-link" >ThemeAttributesEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/TiktokLoginInput.html" data-type="entity-link" >TiktokLoginInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/Token.html" data-type="entity-link" >Token</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateBankDetailInput.html" data-type="entity-link" >UpdateBankDetailInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateChimeInput.html" data-type="entity-link" >UpdateChimeInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateCometChatGroupInput.html" data-type="entity-link" >UpdateCometChatGroupInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateContactInput.html" data-type="entity-link" >UpdateContactInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateFAQDto.html" data-type="entity-link" >UpdateFAQDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateFeedCommentInput.html" data-type="entity-link" >UpdateFeedCommentInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateFeedInput.html" data-type="entity-link" >UpdateFeedInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateFeedReplyInput.html" data-type="entity-link" >UpdateFeedReplyInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateNotificationInput.html" data-type="entity-link" >UpdateNotificationInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdatePhoneNumberInput.html" data-type="entity-link" >UpdatePhoneNumberInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateSettingInput.html" data-type="entity-link" >UpdateSettingInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateStripeSubscriptionInput.html" data-type="entity-link" >UpdateStripeSubscriptionInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserEmailDto.html" data-type="entity-link" >UpdateUserEmailDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserInput.html" data-type="entity-link" >UpdateUserInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserProfile.html" data-type="entity-link" >UpdateUserProfile</a>
                            </li>
                            <li class="link">
                                <a href="classes/UploadFileInput.html" data-type="entity-link" >UploadFileInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/User.html" data-type="entity-link" >User</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserDetailsResponse.html" data-type="entity-link" >UserDetailsResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserProfileResponse.html" data-type="entity-link" >UserProfileResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserProfilesListResponse.html" data-type="entity-link" >UserProfilesListResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserRespInAppleLogin.html" data-type="entity-link" >UserRespInAppleLogin</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserRespInEmailLogin.html" data-type="entity-link" >UserRespInEmailLogin</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserRespInFacebookLogin.html" data-type="entity-link" >UserRespInFacebookLogin</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserRespInGoogleLogin.html" data-type="entity-link" >UserRespInGoogleLogin</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserRespInLogin.html" data-type="entity-link" >UserRespInLogin</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserRespInSocialLogin.html" data-type="entity-link" >UserRespInSocialLogin</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserResponse.html" data-type="entity-link" >UserResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/UsersResolver.html" data-type="entity-link" >UsersResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserWithToken.html" data-type="entity-link" >UserWithToken</a>
                            </li>
                            <li class="link">
                                <a href="classes/VerificationCodeExpiry.html" data-type="entity-link" >VerificationCodeExpiry</a>
                            </li>
                            <li class="link">
                                <a href="classes/VerifyEmailInput.html" data-type="entity-link" >VerifyEmailInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/VerifyEmailResponse.html" data-type="entity-link" >VerifyEmailResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/VerifyResetPasswordOtpInput.html" data-type="entity-link" >VerifyResetPasswordOtpInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/VerifyUpdatedPhoneNumberInput.html" data-type="entity-link" >VerifyUpdatedPhoneNumberInput</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthUserGuard.html" data-type="entity-link" >AuthUserGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ClusterService.html" data-type="entity-link" >ClusterService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtRefreshGuard.html" data-type="entity-link" >JwtRefreshGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtRefreshTokenStrategy.html" data-type="entity-link" >JwtRefreshTokenStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtStrategy.html" data-type="entity-link" >JwtStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PhoneOtpAuthService.html" data-type="entity-link" >PhoneOtpAuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RapidIdVerificationService.html" data-type="entity-link" >RapidIdVerificationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SetPasswordGuard.html" data-type="entity-link" >SetPasswordGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StripePaymentLogRepository.html" data-type="entity-link" >StripePaymentLogRepository</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StripePaymentRepository.html" data-type="entity-link" >StripePaymentRepository</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StripePaymentService.html" data-type="entity-link" >StripePaymentService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StripeWebhookService.html" data-type="entity-link" >StripeWebhookService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StripeWebhookService-1.html" data-type="entity-link" >StripeWebhookService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UsersService.html" data-type="entity-link" >UsersService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/StripeConnectWebhookGuard.html" data-type="entity-link" >StripeConnectWebhookGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/StripeWebhookGuard.html" data-type="entity-link" >StripeWebhookGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/TermsGuard.html" data-type="entity-link" >TermsGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/AddCommentAttributes.html" data-type="entity-link" >AddCommentAttributes</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CometChatPushPayload.html" data-type="entity-link" >CometChatPushPayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ContactData.html" data-type="entity-link" >ContactData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FeedCommentNotificationThemeAttributes.html" data-type="entity-link" >FeedCommentNotificationThemeAttributes</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FeedCommentPushPayload.html" data-type="entity-link" >FeedCommentPushPayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IAndroidSubscriptionWebhook.html" data-type="entity-link" >IAndroidSubscriptionWebhook</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/InsertContactData.html" data-type="entity-link" >InsertContactData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IosSubscriptionWebhookInterface.html" data-type="entity-link" >IosSubscriptionWebhookInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPaymentIntentData.html" data-type="entity-link" >IPaymentIntentData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MedicareVerificationInput.html" data-type="entity-link" >MedicareVerificationInput</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MessageEvent.html" data-type="entity-link" >MessageEvent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NotificationInput.html" data-type="entity-link" >NotificationInput</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PhoneNumbers.html" data-type="entity-link" >PhoneNumbers</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UpdateProfilInterface.html" data-type="entity-link" >UpdateProfilInterface</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});