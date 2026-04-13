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
                                <a href="modules/AdminModule.html" data-type="entity-link" >AdminModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AdminModule-0f6c49cc269764f0b4222bdbab500dc1f948899ea92bed911471aeacd6b4502a30e7aa7adb1fba1e52f3707d710e9b07ff52f58789e56fbfadf5bb07dafef5d9"' : 'data-bs-target="#xs-injectables-links-module-AdminModule-0f6c49cc269764f0b4222bdbab500dc1f948899ea92bed911471aeacd6b4502a30e7aa7adb1fba1e52f3707d710e9b07ff52f58789e56fbfadf5bb07dafef5d9"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AdminModule-0f6c49cc269764f0b4222bdbab500dc1f948899ea92bed911471aeacd6b4502a30e7aa7adb1fba1e52f3707d710e9b07ff52f58789e56fbfadf5bb07dafef5d9"' :
                                        'id="xs-injectables-links-module-AdminModule-0f6c49cc269764f0b4222bdbab500dc1f948899ea92bed911471aeacd6b4502a30e7aa7adb1fba1e52f3707d710e9b07ff52f58789e56fbfadf5bb07dafef5d9"' }>
                                        <li class="link">
                                            <a href="injectables/AdminService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AdminService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AdvancePageModule.html" data-type="entity-link" >AdvancePageModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AdvancePageModule-72dab90ff7938b32a409d3ba6793c169f4cde57d326d72ff2a98256f34b03bd06f6b6b6d5488981f8bce09c01af6b7844e61e1b0954ac84ae1464132cc23089c"' : 'data-bs-target="#xs-injectables-links-module-AdvancePageModule-72dab90ff7938b32a409d3ba6793c169f4cde57d326d72ff2a98256f34b03bd06f6b6b6d5488981f8bce09c01af6b7844e61e1b0954ac84ae1464132cc23089c"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AdvancePageModule-72dab90ff7938b32a409d3ba6793c169f4cde57d326d72ff2a98256f34b03bd06f6b6b6d5488981f8bce09c01af6b7844e61e1b0954ac84ae1464132cc23089c"' :
                                        'id="xs-injectables-links-module-AdvancePageModule-72dab90ff7938b32a409d3ba6793c169f4cde57d326d72ff2a98256f34b03bd06f6b6b6d5488981f8bce09c01af6b7844e61e1b0954ac84ae1464132cc23089c"' }>
                                        <li class="link">
                                            <a href="injectables/AdminService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AdminService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AppUserModule.html" data-type="entity-link" >AppUserModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppUserModule-6e353fa760599af4b05ba18f6fee973fff3e476ab33a3987ae7070ce9c377ac2e3eaa0fdd4644f4b7d725bb6d0454a385d37a83d12882683f66fb262e4645465"' : 'data-bs-target="#xs-injectables-links-module-AppUserModule-6e353fa760599af4b05ba18f6fee973fff3e476ab33a3987ae7070ce9c377ac2e3eaa0fdd4644f4b7d725bb6d0454a385d37a83d12882683f66fb262e4645465"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppUserModule-6e353fa760599af4b05ba18f6fee973fff3e476ab33a3987ae7070ce9c377ac2e3eaa0fdd4644f4b7d725bb6d0454a385d37a83d12882683f66fb262e4645465"' :
                                        'id="xs-injectables-links-module-AppUserModule-6e353fa760599af4b05ba18f6fee973fff3e476ab33a3987ae7070ce9c377ac2e3eaa0fdd4644f4b7d725bb6d0454a385d37a83d12882683f66fb262e4645465"' }>
                                        <li class="link">
                                            <a href="injectables/AdminService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AdminService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthModule-658d2055c514e66a379322c9b9c159d53af8a993eff73fc3b6e370b5177d4de5fe952220c64d749cf9bd84dc4987e834000ce1e730667cf97d97e35e1a604539"' : 'data-bs-target="#xs-injectables-links-module-AuthModule-658d2055c514e66a379322c9b9c159d53af8a993eff73fc3b6e370b5177d4de5fe952220c64d749cf9bd84dc4987e834000ce1e730667cf97d97e35e1a604539"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-658d2055c514e66a379322c9b9c159d53af8a993eff73fc3b6e370b5177d4de5fe952220c64d749cf9bd84dc4987e834000ce1e730667cf97d97e35e1a604539"' :
                                        'id="xs-injectables-links-module-AuthModule-658d2055c514e66a379322c9b9c159d53af8a993eff73fc3b6e370b5177d4de5fe952220c64d749cf9bd84dc4987e834000ce1e730667cf97d97e35e1a604539"' }>
                                        <li class="link">
                                            <a href="injectables/AdminService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AdminService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/BusinessModule.html" data-type="entity-link" >BusinessModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-BusinessModule-eda69025c441c3716f7955cac0407c8d97ccedd04fc936b6227d10d5390c0a20045097004431341de2e5ae5a64c6e2362aa41e36ea9a6620fd0f32e36dd47159"' : 'data-bs-target="#xs-injectables-links-module-BusinessModule-eda69025c441c3716f7955cac0407c8d97ccedd04fc936b6227d10d5390c0a20045097004431341de2e5ae5a64c6e2362aa41e36ea9a6620fd0f32e36dd47159"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-BusinessModule-eda69025c441c3716f7955cac0407c8d97ccedd04fc936b6227d10d5390c0a20045097004431341de2e5ae5a64c6e2362aa41e36ea9a6620fd0f32e36dd47159"' :
                                        'id="xs-injectables-links-module-BusinessModule-eda69025c441c3716f7955cac0407c8d97ccedd04fc936b6227d10d5390c0a20045097004431341de2e5ae5a64c6e2362aa41e36ea9a6620fd0f32e36dd47159"' }>
                                        <li class="link">
                                            <a href="injectables/BusinessService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BusinessService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/EmailTemplateModule.html" data-type="entity-link" >EmailTemplateModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-EmailTemplateModule-85457841c3cc3db300f66b351d03366d80b9c3a7e495891e5decbf567783e530c1bfd636b97d983f17e63336c880384f87006cb12422eae6c00d271ad83feaea"' : 'data-bs-target="#xs-injectables-links-module-EmailTemplateModule-85457841c3cc3db300f66b351d03366d80b9c3a7e495891e5decbf567783e530c1bfd636b97d983f17e63336c880384f87006cb12422eae6c00d271ad83feaea"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-EmailTemplateModule-85457841c3cc3db300f66b351d03366d80b9c3a7e495891e5decbf567783e530c1bfd636b97d983f17e63336c880384f87006cb12422eae6c00d271ad83feaea"' :
                                        'id="xs-injectables-links-module-EmailTemplateModule-85457841c3cc3db300f66b351d03366d80b9c3a7e495891e5decbf567783e530c1bfd636b97d983f17e63336c880384f87006cb12422eae6c00d271ad83feaea"' }>
                                        <li class="link">
                                            <a href="injectables/EmailTemplateService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EmailTemplateService</a>
                                        </li>
                                    </ul>
                                </li>
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
                                <a href="modules/HomePageTemplateModule.html" data-type="entity-link" >HomePageTemplateModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-HomePageTemplateModule-6fd2028f1683b416369e116fe3f84e571ff8d6469ba12f73300f6ac3266faa8167715423b76334c19693b7785a1bce9db9abcc72f1f215616a520f3ce9fb8aae"' : 'data-bs-target="#xs-injectables-links-module-HomePageTemplateModule-6fd2028f1683b416369e116fe3f84e571ff8d6469ba12f73300f6ac3266faa8167715423b76334c19693b7785a1bce9db9abcc72f1f215616a520f3ce9fb8aae"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-HomePageTemplateModule-6fd2028f1683b416369e116fe3f84e571ff8d6469ba12f73300f6ac3266faa8167715423b76334c19693b7785a1bce9db9abcc72f1f215616a520f3ce9fb8aae"' :
                                        'id="xs-injectables-links-module-HomePageTemplateModule-6fd2028f1683b416369e116fe3f84e571ff8d6469ba12f73300f6ac3266faa8167715423b76334c19693b7785a1bce9db9abcc72f1f215616a520f3ce9fb8aae"' }>
                                        <li class="link">
                                            <a href="injectables/HomePageTemplateService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HomePageTemplateService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/MenuModule.html" data-type="entity-link" >MenuModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-MenuModule-9e8d13e3b04a94669a5f5dfc6715d37762c3d047744fc7736254f6daca79558f93781f741022f781296feed3ed81edb2de75a84c58d803f09743f55dfb1f74ef"' : 'data-bs-target="#xs-injectables-links-module-MenuModule-9e8d13e3b04a94669a5f5dfc6715d37762c3d047744fc7736254f6daca79558f93781f741022f781296feed3ed81edb2de75a84c58d803f09743f55dfb1f74ef"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-MenuModule-9e8d13e3b04a94669a5f5dfc6715d37762c3d047744fc7736254f6daca79558f93781f741022f781296feed3ed81edb2de75a84c58d803f09743f55dfb1f74ef"' :
                                        'id="xs-injectables-links-module-MenuModule-9e8d13e3b04a94669a5f5dfc6715d37762c3d047744fc7736254f6daca79558f93781f741022f781296feed3ed81edb2de75a84c58d803f09743f55dfb1f74ef"' }>
                                        <li class="link">
                                            <a href="injectables/AdminService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AdminService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/PageModule.html" data-type="entity-link" >PageModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-PageModule-de46beb89d7c3e4bbb3af3af99b7c887eb0049a7c641cb8195deaaefd15a77de75429fb06b28231d49d86058e260ab0d95214a332ae4243a76a869220755cf61"' : 'data-bs-target="#xs-injectables-links-module-PageModule-de46beb89d7c3e4bbb3af3af99b7c887eb0049a7c641cb8195deaaefd15a77de75429fb06b28231d49d86058e260ab0d95214a332ae4243a76a869220755cf61"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-PageModule-de46beb89d7c3e4bbb3af3af99b7c887eb0049a7c641cb8195deaaefd15a77de75429fb06b28231d49d86058e260ab0d95214a332ae4243a76a869220755cf61"' :
                                        'id="xs-injectables-links-module-PageModule-de46beb89d7c3e4bbb3af3af99b7c887eb0049a7c641cb8195deaaefd15a77de75429fb06b28231d49d86058e260ab0d95214a332ae4243a76a869220755cf61"' }>
                                        <li class="link">
                                            <a href="injectables/PageService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PageService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/PageWithVersionModule.html" data-type="entity-link" >PageWithVersionModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-PageWithVersionModule-d6f509e43bde569d3169cb788d84e2b6a911326861d4246a11d0dd012361e1eb977077eab8559184844d1c693bfa55bb5f19e7616d2461b632521c1550b358b8"' : 'data-bs-target="#xs-injectables-links-module-PageWithVersionModule-d6f509e43bde569d3169cb788d84e2b6a911326861d4246a11d0dd012361e1eb977077eab8559184844d1c693bfa55bb5f19e7616d2461b632521c1550b358b8"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-PageWithVersionModule-d6f509e43bde569d3169cb788d84e2b6a911326861d4246a11d0dd012361e1eb977077eab8559184844d1c693bfa55bb5f19e7616d2461b632521c1550b358b8"' :
                                        'id="xs-injectables-links-module-PageWithVersionModule-d6f509e43bde569d3169cb788d84e2b6a911326861d4246a11d0dd012361e1eb977077eab8559184844d1c693bfa55bb5f19e7616d2461b632521c1550b358b8"' }>
                                        <li class="link">
                                            <a href="injectables/PageWithVersionService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PageWithVersionService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/PermissionModule.html" data-type="entity-link" >PermissionModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-PermissionModule-e8514aec735cb6b483a28cf4828342331b8e1cc0d6bdfe62e51df6d9bed74bd13bd2a921381ad7133eeb10ce854f8e7fa6fc1046eae395c12b7476b2e53d84b8"' : 'data-bs-target="#xs-injectables-links-module-PermissionModule-e8514aec735cb6b483a28cf4828342331b8e1cc0d6bdfe62e51df6d9bed74bd13bd2a921381ad7133eeb10ce854f8e7fa6fc1046eae395c12b7476b2e53d84b8"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-PermissionModule-e8514aec735cb6b483a28cf4828342331b8e1cc0d6bdfe62e51df6d9bed74bd13bd2a921381ad7133eeb10ce854f8e7fa6fc1046eae395c12b7476b2e53d84b8"' :
                                        'id="xs-injectables-links-module-PermissionModule-e8514aec735cb6b483a28cf4828342331b8e1cc0d6bdfe62e51df6d9bed74bd13bd2a921381ad7133eeb10ce854f8e7fa6fc1046eae395c12b7476b2e53d84b8"' }>
                                        <li class="link">
                                            <a href="injectables/PermissionService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PermissionService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/RoleModule.html" data-type="entity-link" >RoleModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-RoleModule-ef1a0b90babcb61e023ba4a4a56fcd67e8b4f44d3e11d497fd29d2b080f6127a74f67c4941b93419db6fd4730a84c052e80e3b8a77c3cedd937a9ac5281ab06b"' : 'data-bs-target="#xs-injectables-links-module-RoleModule-ef1a0b90babcb61e023ba4a4a56fcd67e8b4f44d3e11d497fd29d2b080f6127a74f67c4941b93419db6fd4730a84c052e80e3b8a77c3cedd937a9ac5281ab06b"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-RoleModule-ef1a0b90babcb61e023ba4a4a56fcd67e8b4f44d3e11d497fd29d2b080f6127a74f67c4941b93419db6fd4730a84c052e80e3b8a77c3cedd937a9ac5281ab06b"' :
                                        'id="xs-injectables-links-module-RoleModule-ef1a0b90babcb61e023ba4a4a56fcd67e8b4f44d3e11d497fd29d2b080f6127a74f67c4941b93419db6fd4730a84c052e80e3b8a77c3cedd937a9ac5281ab06b"' }>
                                        <li class="link">
                                            <a href="injectables/RoleService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RoleService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SettingModule.html" data-type="entity-link" >SettingModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-SettingModule-e7b9c662a3e93467a2e83bcac4f8a42d05b31c222081feb6b6650c1be6ead605666974e71b237c6a04df91f5ab5f911764b2c3058eef66c1c3658fba7b3c198b"' : 'data-bs-target="#xs-injectables-links-module-SettingModule-e7b9c662a3e93467a2e83bcac4f8a42d05b31c222081feb6b6650c1be6ead605666974e71b237c6a04df91f5ab5f911764b2c3058eef66c1c3658fba7b3c198b"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SettingModule-e7b9c662a3e93467a2e83bcac4f8a42d05b31c222081feb6b6650c1be6ead605666974e71b237c6a04df91f5ab5f911764b2c3058eef66c1c3658fba7b3c198b"' :
                                        'id="xs-injectables-links-module-SettingModule-e7b9c662a3e93467a2e83bcac4f8a42d05b31c222081feb6b6650c1be6ead605666974e71b237c6a04df91f5ab5f911764b2c3058eef66c1c3658fba7b3c198b"' }>
                                        <li class="link">
                                            <a href="injectables/AdminService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AdminService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SiteSettingsModule.html" data-type="entity-link" >SiteSettingsModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-SiteSettingsModule-70ef40a0c7d7dffbe827f3770ceb7e83b6a4c3329561e66b3c669d87de01a9483968a52b1c123b6ee96545f0e9334593f94c28d3870d530161118dff9bc87de3"' : 'data-bs-target="#xs-injectables-links-module-SiteSettingsModule-70ef40a0c7d7dffbe827f3770ceb7e83b6a4c3329561e66b3c669d87de01a9483968a52b1c123b6ee96545f0e9334593f94c28d3870d530161118dff9bc87de3"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SiteSettingsModule-70ef40a0c7d7dffbe827f3770ceb7e83b6a4c3329561e66b3c669d87de01a9483968a52b1c123b6ee96545f0e9334593f94c28d3870d530161118dff9bc87de3"' :
                                        'id="xs-injectables-links-module-SiteSettingsModule-70ef40a0c7d7dffbe827f3770ceb7e83b6a4c3329561e66b3c669d87de01a9483968a52b1c123b6ee96545f0e9334593f94c28d3870d530161118dff9bc87de3"' }>
                                        <li class="link">
                                            <a href="injectables/SiteSettingsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SiteSettingsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SubscriptionProductsModule.html" data-type="entity-link" >SubscriptionProductsModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-SubscriptionProductsModule-85401ac743f37f9a5fe946064eff8bfc0e9838c06e0f93c178081b54a88bb9cf64ac3dfe00ced5525a103bbaa23b81cf32ebbb8d52cbfa22b96f262e7cafbc49"' : 'data-bs-target="#xs-injectables-links-module-SubscriptionProductsModule-85401ac743f37f9a5fe946064eff8bfc0e9838c06e0f93c178081b54a88bb9cf64ac3dfe00ced5525a103bbaa23b81cf32ebbb8d52cbfa22b96f262e7cafbc49"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SubscriptionProductsModule-85401ac743f37f9a5fe946064eff8bfc0e9838c06e0f93c178081b54a88bb9cf64ac3dfe00ced5525a103bbaa23b81cf32ebbb8d52cbfa22b96f262e7cafbc49"' :
                                        'id="xs-injectables-links-module-SubscriptionProductsModule-85401ac743f37f9a5fe946064eff8bfc0e9838c06e0f93c178081b54a88bb9cf64ac3dfe00ced5525a103bbaa23b81cf32ebbb8d52cbfa22b96f262e7cafbc49"' }>
                                        <li class="link">
                                            <a href="injectables/SubscriptionProductsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SubscriptionProductsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/TaxonomyModule.html" data-type="entity-link" >TaxonomyModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-TaxonomyModule-db6360dd81240836ce0efff7ffeb6389e5080336867963adfe08be69eb86968a75ab7ed69116f1106de3db993d53e8cb495ef52250f8957c03818d958a7dcb15"' : 'data-bs-target="#xs-injectables-links-module-TaxonomyModule-db6360dd81240836ce0efff7ffeb6389e5080336867963adfe08be69eb86968a75ab7ed69116f1106de3db993d53e8cb495ef52250f8957c03818d958a7dcb15"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-TaxonomyModule-db6360dd81240836ce0efff7ffeb6389e5080336867963adfe08be69eb86968a75ab7ed69116f1106de3db993d53e8cb495ef52250f8957c03818d958a7dcb15"' :
                                        'id="xs-injectables-links-module-TaxonomyModule-db6360dd81240836ce0efff7ffeb6389e5080336867963adfe08be69eb86968a75ab7ed69116f1106de3db993d53e8cb495ef52250f8957c03818d958a7dcb15"' }>
                                        <li class="link">
                                            <a href="injectables/AdminService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AdminService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/TestimonialsModule.html" data-type="entity-link" >TestimonialsModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-TestimonialsModule-13cd9eaac5c10964533768700fd89bd7ccb0c19fa912611fda6ea5873347a9244ddebf5f8c523f5f9193321f8923578aea20a181ef39d92bc05872b63144ab67"' : 'data-bs-target="#xs-injectables-links-module-TestimonialsModule-13cd9eaac5c10964533768700fd89bd7ccb0c19fa912611fda6ea5873347a9244ddebf5f8c523f5f9193321f8923578aea20a181ef39d92bc05872b63144ab67"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-TestimonialsModule-13cd9eaac5c10964533768700fd89bd7ccb0c19fa912611fda6ea5873347a9244ddebf5f8c523f5f9193321f8923578aea20a181ef39d92bc05872b63144ab67"' :
                                        'id="xs-injectables-links-module-TestimonialsModule-13cd9eaac5c10964533768700fd89bd7ccb0c19fa912611fda6ea5873347a9244ddebf5f8c523f5f9193321f8923578aea20a181ef39d92bc05872b63144ab67"' }>
                                        <li class="link">
                                            <a href="injectables/TestimonialsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TestimonialsService</a>
                                        </li>
                                    </ul>
                                </li>
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
                                <a href="classes/Address.html" data-type="entity-link" >Address</a>
                            </li>
                            <li class="link">
                                <a href="classes/AdminLoginResponse.html" data-type="entity-link" >AdminLoginResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/AdminResolver.html" data-type="entity-link" >AdminResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/AdminResponse.html" data-type="entity-link" >AdminResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/AdminType.html" data-type="entity-link" >AdminType</a>
                            </li>
                            <li class="link">
                                <a href="classes/AdvancePage.html" data-type="entity-link" >AdvancePage</a>
                            </li>
                            <li class="link">
                                <a href="classes/AdvancePageResolver.html" data-type="entity-link" >AdvancePageResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/AdvancePageResponse.html" data-type="entity-link" >AdvancePageResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/AllAdvancePagesResponse.html" data-type="entity-link" >AllAdvancePagesResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/AppUser.html" data-type="entity-link" >AppUser</a>
                            </li>
                            <li class="link">
                                <a href="classes/AppUserChangePasswordDTO.html" data-type="entity-link" >AppUserChangePasswordDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/AppUserResetPasswordDTO.html" data-type="entity-link" >AppUserResetPasswordDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/AppUserResolver.html" data-type="entity-link" >AppUserResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/AppUserResponse.html" data-type="entity-link" >AppUserResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthResolver.html" data-type="entity-link" >AuthResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthResponse.html" data-type="entity-link" >AuthResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthUrlResponse.html" data-type="entity-link" >AuthUrlResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/Banner.html" data-type="entity-link" >Banner</a>
                            </li>
                            <li class="link">
                                <a href="classes/BannerButton.html" data-type="entity-link" >BannerButton</a>
                            </li>
                            <li class="link">
                                <a href="classes/BannerButtonInput.html" data-type="entity-link" >BannerButtonInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/BannerInput.html" data-type="entity-link" >BannerInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/BannerInputPage.html" data-type="entity-link" >BannerInputPage</a>
                            </li>
                            <li class="link">
                                <a href="classes/BannerSchema.html" data-type="entity-link" >BannerSchema</a>
                            </li>
                            <li class="link">
                                <a href="classes/BaseCreatePage.html" data-type="entity-link" >BaseCreatePage</a>
                            </li>
                            <li class="link">
                                <a href="classes/BaseCreatePage-1.html" data-type="entity-link" >BaseCreatePage</a>
                            </li>
                            <li class="link">
                                <a href="classes/BasePageResponseDTO.html" data-type="entity-link" >BasePageResponseDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/BasePageResponseDTO-1.html" data-type="entity-link" >BasePageResponseDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/BasePaginationParams.html" data-type="entity-link" >BasePaginationParams</a>
                            </li>
                            <li class="link">
                                <a href="classes/BaseResponseDTO.html" data-type="entity-link" >BaseResponseDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/BusinessResolver.html" data-type="entity-link" >BusinessResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/BusinessResponse.html" data-type="entity-link" >BusinessResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/BusinessUser.html" data-type="entity-link" >BusinessUser</a>
                            </li>
                            <li class="link">
                                <a href="classes/BusinessUserResponse.html" data-type="entity-link" >BusinessUserResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/ChangePasswordDTO.html" data-type="entity-link" >ChangePasswordDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ChangePasswordResponse.html" data-type="entity-link" >ChangePasswordResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/ChangePasswordResponse-1.html" data-type="entity-link" >ChangePasswordResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/Content.html" data-type="entity-link" >Content</a>
                            </li>
                            <li class="link">
                                <a href="classes/ContentType.html" data-type="entity-link" >ContentType</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateAdminDTO.html" data-type="entity-link" >CreateAdminDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateAdvancePageDTO.html" data-type="entity-link" >CreateAdvancePageDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateAppUserDTO.html" data-type="entity-link" >CreateAppUserDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateBusinessUserInput.html" data-type="entity-link" >CreateBusinessUserInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateEmailTemplateDTO.html" data-type="entity-link" >CreateEmailTemplateDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateFAQDto.html" data-type="entity-link" >CreateFAQDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateHomePageTemplateDto.html" data-type="entity-link" >CreateHomePageTemplateDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateMenuDTO.html" data-type="entity-link" >CreateMenuDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreatePageInput.html" data-type="entity-link" >CreatePageInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreatePageWithVersionInput.html" data-type="entity-link" >CreatePageWithVersionInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreatePermissionDto.html" data-type="entity-link" >CreatePermissionDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateRoleDto.html" data-type="entity-link" >CreateRoleDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateSubscriptionProductInput.html" data-type="entity-link" >CreateSubscriptionProductInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateTaxonDTO.html" data-type="entity-link" >CreateTaxonDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateTaxonomyDTO.html" data-type="entity-link" >CreateTaxonomyDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateTestimonialDto.html" data-type="entity-link" >CreateTestimonialDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/Customer.html" data-type="entity-link" >Customer</a>
                            </li>
                            <li class="link">
                                <a href="classes/CustomerSchema.html" data-type="entity-link" >CustomerSchema</a>
                            </li>
                            <li class="link">
                                <a href="classes/EmailTemplate.html" data-type="entity-link" >EmailTemplate</a>
                            </li>
                            <li class="link">
                                <a href="classes/EmailTemplateResolver.html" data-type="entity-link" >EmailTemplateResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/EmailTemplateResponse.html" data-type="entity-link" >EmailTemplateResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/Faq.html" data-type="entity-link" >Faq</a>
                            </li>
                            <li class="link">
                                <a href="classes/FAQ.html" data-type="entity-link" >FAQ</a>
                            </li>
                            <li class="link">
                                <a href="classes/FAQContent.html" data-type="entity-link" >FAQContent</a>
                            </li>
                            <li class="link">
                                <a href="classes/FAQContentSchema.html" data-type="entity-link" >FAQContentSchema</a>
                            </li>
                            <li class="link">
                                <a href="classes/FaqInput.html" data-type="entity-link" >FaqInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/FAQInput.html" data-type="entity-link" >FAQInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/FaqResolver.html" data-type="entity-link" >FaqResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/FAQResponse.html" data-type="entity-link" >FAQResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/FAQSchema.html" data-type="entity-link" >FAQSchema</a>
                            </li>
                            <li class="link">
                                <a href="classes/FeaturedProductInput.html" data-type="entity-link" >FeaturedProductInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/FeaturedProductsInputPage.html" data-type="entity-link" >FeaturedProductsInputPage</a>
                            </li>
                            <li class="link">
                                <a href="classes/FeaturedProductsMeta.html" data-type="entity-link" >FeaturedProductsMeta</a>
                            </li>
                            <li class="link">
                                <a href="classes/FeaturedProductsMetaSchema.html" data-type="entity-link" >FeaturedProductsMetaSchema</a>
                            </li>
                            <li class="link">
                                <a href="classes/FeaturedProductsPage.html" data-type="entity-link" >FeaturedProductsPage</a>
                            </li>
                            <li class="link">
                                <a href="classes/FeaturedProductsSchema.html" data-type="entity-link" >FeaturedProductsSchema</a>
                            </li>
                            <li class="link">
                                <a href="classes/FeaturedProductsSections.html" data-type="entity-link" >FeaturedProductsSections</a>
                            </li>
                            <li class="link">
                                <a href="classes/file.html" data-type="entity-link" >file</a>
                            </li>
                            <li class="link">
                                <a href="classes/file1.html" data-type="entity-link" >file1</a>
                            </li>
                            <li class="link">
                                <a href="classes/FileImageResponse.html" data-type="entity-link" >FileImageResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/FileResponse.html" data-type="entity-link" >FileResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/FileResponse1.html" data-type="entity-link" >FileResponse1</a>
                            </li>
                            <li class="link">
                                <a href="classes/fileType.html" data-type="entity-link" >fileType</a>
                            </li>
                            <li class="link">
                                <a href="classes/ForgotPasswordDTO.html" data-type="entity-link" >ForgotPasswordDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ForgotPasswordDTO-1.html" data-type="entity-link" >ForgotPasswordDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ForgotPasswordResponse.html" data-type="entity-link" >ForgotPasswordResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAdminListDTO.html" data-type="entity-link" >GetAdminListDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAdvancePagesDTO.html" data-type="entity-link" >GetAdvancePagesDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAllAdvancePagesDTO.html" data-type="entity-link" >GetAllAdvancePagesDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAllBusinessInputDTO.html" data-type="entity-link" >GetAllBusinessInputDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAllPagesInputDTO.html" data-type="entity-link" >GetAllPagesInputDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAllPagesWithVersionInputDTO.html" data-type="entity-link" >GetAllPagesWithVersionInputDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAppUsersDTO.html" data-type="entity-link" >GetAppUsersDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetEmailTemplateDTO.html" data-type="entity-link" >GetEmailTemplateDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetFAQDto.html" data-type="entity-link" >GetFAQDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetHomePageTemplateDto.html" data-type="entity-link" >GetHomePageTemplateDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetMenusDTO.html" data-type="entity-link" >GetMenusDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetPermissionDto.html" data-type="entity-link" >GetPermissionDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetRoleDto.html" data-type="entity-link" >GetRoleDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetSettingsDTO.html" data-type="entity-link" >GetSettingsDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetTaxonByTaxonomyIdDTO.html" data-type="entity-link" >GetTaxonByTaxonomyIdDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetTaxonsDTO.html" data-type="entity-link" >GetTaxonsDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetTestimonialsDto.html" data-type="entity-link" >GetTestimonialsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/HeaderInput.html" data-type="entity-link" >HeaderInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/HomeBannerInput.html" data-type="entity-link" >HomeBannerInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/HomeBannerSchema.html" data-type="entity-link" >HomeBannerSchema</a>
                            </li>
                            <li class="link">
                                <a href="classes/HomePageTemplate.html" data-type="entity-link" >HomePageTemplate</a>
                            </li>
                            <li class="link">
                                <a href="classes/HomePageTemplateResolver.html" data-type="entity-link" >HomePageTemplateResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/HomePageTemplateResponse.html" data-type="entity-link" >HomePageTemplateResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/HowItWorksInputPage.html" data-type="entity-link" >HowItWorksInputPage</a>
                            </li>
                            <li class="link">
                                <a href="classes/HowItWorksPage.html" data-type="entity-link" >HowItWorksPage</a>
                            </li>
                            <li class="link">
                                <a href="classes/HowItWorksSection.html" data-type="entity-link" >HowItWorksSection</a>
                            </li>
                            <li class="link">
                                <a href="classes/HowItWorksSectionInput.html" data-type="entity-link" >HowItWorksSectionInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/ImageColumnInput.html" data-type="entity-link" >ImageColumnInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/ImageColumnInputPage.html" data-type="entity-link" >ImageColumnInputPage</a>
                            </li>
                            <li class="link">
                                <a href="classes/ImageColumnMeta.html" data-type="entity-link" >ImageColumnMeta</a>
                            </li>
                            <li class="link">
                                <a href="classes/ImageColumnMetaSchema.html" data-type="entity-link" >ImageColumnMetaSchema</a>
                            </li>
                            <li class="link">
                                <a href="classes/ImageColumnPage.html" data-type="entity-link" >ImageColumnPage</a>
                            </li>
                            <li class="link">
                                <a href="classes/ImageColumnSchema.html" data-type="entity-link" >ImageColumnSchema</a>
                            </li>
                            <li class="link">
                                <a href="classes/ImageColumnSection.html" data-type="entity-link" >ImageColumnSection</a>
                            </li>
                            <li class="link">
                                <a href="classes/ImageColumnSectionInput.html" data-type="entity-link" >ImageColumnSectionInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/JwtStrategy.html" data-type="entity-link" >JwtStrategy</a>
                            </li>
                            <li class="link">
                                <a href="classes/LocalStrategy.html" data-type="entity-link" >LocalStrategy</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginAdminDTO.html" data-type="entity-link" >LoginAdminDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/Menu.html" data-type="entity-link" >Menu</a>
                            </li>
                            <li class="link">
                                <a href="classes/MenuItem.html" data-type="entity-link" >MenuItem</a>
                            </li>
                            <li class="link">
                                <a href="classes/MenuItemChild.html" data-type="entity-link" >MenuItemChild</a>
                            </li>
                            <li class="link">
                                <a href="classes/MenuItemChildResponse.html" data-type="entity-link" >MenuItemChildResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/MenuItemResponse.html" data-type="entity-link" >MenuItemResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/MenuResolver.html" data-type="entity-link" >MenuResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/MenuResponse.html" data-type="entity-link" >MenuResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/OptionsData.html" data-type="entity-link" >OptionsData</a>
                            </li>
                            <li class="link">
                                <a href="classes/OptionsInput.html" data-type="entity-link" >OptionsInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/OptionsResponse.html" data-type="entity-link" >OptionsResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/OtpVerificationFor2FADTO.html" data-type="entity-link" >OtpVerificationFor2FADTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/PageResolver.html" data-type="entity-link" >PageResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/PageResponse.html" data-type="entity-link" >PageResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/PageResponseDTO.html" data-type="entity-link" >PageResponseDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/PageWithVersionResolver.html" data-type="entity-link" >PageWithVersionResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/PageWithVersionResponse.html" data-type="entity-link" >PageWithVersionResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/PageWithVersionResponseDTO.html" data-type="entity-link" >PageWithVersionResponseDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/PageWithVersionSeoTags.html" data-type="entity-link" >PageWithVersionSeoTags</a>
                            </li>
                            <li class="link">
                                <a href="classes/PaginatedSubscriptionProductResponse.html" data-type="entity-link" >PaginatedSubscriptionProductResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/PaginationType.html" data-type="entity-link" >PaginationType</a>
                            </li>
                            <li class="link">
                                <a href="classes/Permission.html" data-type="entity-link" >Permission</a>
                            </li>
                            <li class="link">
                                <a href="classes/PermissionResolver.html" data-type="entity-link" >PermissionResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/PermissionResponse.html" data-type="entity-link" >PermissionResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/Point.html" data-type="entity-link" >Point</a>
                            </li>
                            <li class="link">
                                <a href="classes/PreSignedUrlInput.html" data-type="entity-link" >PreSignedUrlInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/PreSignedUrlResponse.html" data-type="entity-link" >PreSignedUrlResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/PriceResponse.html" data-type="entity-link" >PriceResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/RefreshTokenResponse.html" data-type="entity-link" >RefreshTokenResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/Resend2FAOtpCodeDTO.html" data-type="entity-link" >Resend2FAOtpCodeDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResendOtpCodeResponse.html" data-type="entity-link" >ResendOtpCodeResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResetPasswordDTO.html" data-type="entity-link" >ResetPasswordDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResetPasswordOtpVerificationDTO.html" data-type="entity-link" >ResetPasswordOtpVerificationDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResetPasswordOtpVerificationDTO-1.html" data-type="entity-link" >ResetPasswordOtpVerificationDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResetPWOtpVerificationResponse.html" data-type="entity-link" >ResetPWOtpVerificationResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/Role.html" data-type="entity-link" >Role</a>
                            </li>
                            <li class="link">
                                <a href="classes/RolePermissionsInput.html" data-type="entity-link" >RolePermissionsInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/RoleResolver.html" data-type="entity-link" >RoleResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/RoleResponse.html" data-type="entity-link" >RoleResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/SelectedProductsInput.html" data-type="entity-link" >SelectedProductsInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/SendEmailOTPDTO.html" data-type="entity-link" >SendEmailOTPDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/SeoInfoInput.html" data-type="entity-link" >SeoInfoInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/SeoInfoWithVersionInput.html" data-type="entity-link" >SeoInfoWithVersionInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/SEOInput.html" data-type="entity-link" >SEOInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/SEOSchema.html" data-type="entity-link" >SEOSchema</a>
                            </li>
                            <li class="link">
                                <a href="classes/SeoTag.html" data-type="entity-link" >SeoTag</a>
                            </li>
                            <li class="link">
                                <a href="classes/SeoTagInput.html" data-type="entity-link" >SeoTagInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/SeoTags.html" data-type="entity-link" >SeoTags</a>
                            </li>
                            <li class="link">
                                <a href="classes/SettingResolver.html" data-type="entity-link" >SettingResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/Settings.html" data-type="entity-link" >Settings</a>
                            </li>
                            <li class="link">
                                <a href="classes/SettingsResponse.html" data-type="entity-link" >SettingsResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/SettingsUpdate.html" data-type="entity-link" >SettingsUpdate</a>
                            </li>
                            <li class="link">
                                <a href="classes/SiteSettingsResolver.html" data-type="entity-link" >SiteSettingsResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/SiteSettingsResponse.html" data-type="entity-link" >SiteSettingsResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/StepsInput.html" data-type="entity-link" >StepsInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/StepsMeta.html" data-type="entity-link" >StepsMeta</a>
                            </li>
                            <li class="link">
                                <a href="classes/StepsMetaSchema.html" data-type="entity-link" >StepsMetaSchema</a>
                            </li>
                            <li class="link">
                                <a href="classes/StepsSchema.html" data-type="entity-link" >StepsSchema</a>
                            </li>
                            <li class="link">
                                <a href="classes/SubscriptionPrice.html" data-type="entity-link" >SubscriptionPrice</a>
                            </li>
                            <li class="link">
                                <a href="classes/SubscriptionProductResponse.html" data-type="entity-link" >SubscriptionProductResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/SubscriptionProductsResolver.html" data-type="entity-link" >SubscriptionProductsResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/SubsProductResponse.html" data-type="entity-link" >SubsProductResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/Taxon.html" data-type="entity-link" >Taxon</a>
                            </li>
                            <li class="link">
                                <a href="classes/Taxonomy.html" data-type="entity-link" >Taxonomy</a>
                            </li>
                            <li class="link">
                                <a href="classes/TaxonomyResolver.html" data-type="entity-link" >TaxonomyResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/TaxonomyResponse.html" data-type="entity-link" >TaxonomyResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/TaxonResponse.html" data-type="entity-link" >TaxonResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/TemplateResponse.html" data-type="entity-link" >TemplateResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/Testimonial.html" data-type="entity-link" >Testimonial</a>
                            </li>
                            <li class="link">
                                <a href="classes/Testimonials.html" data-type="entity-link" >Testimonials</a>
                            </li>
                            <li class="link">
                                <a href="classes/TestimonialsInput.html" data-type="entity-link" >TestimonialsInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/TestimonialsResolver.html" data-type="entity-link" >TestimonialsResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/TestimonialsResponse.html" data-type="entity-link" >TestimonialsResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/TokenResponse.html" data-type="entity-link" >TokenResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/TokenService.html" data-type="entity-link" >TokenService</a>
                            </li>
                            <li class="link">
                                <a href="classes/TokenType.html" data-type="entity-link" >TokenType</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateAdminDTO.html" data-type="entity-link" >UpdateAdminDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateAdminStatusInput.html" data-type="entity-link" >UpdateAdminStatusInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateAdvancePageDTO.html" data-type="entity-link" >UpdateAdvancePageDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateAppUserDTO.html" data-type="entity-link" >UpdateAppUserDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateBusinessUserInput.html" data-type="entity-link" >UpdateBusinessUserInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateEmailTemplateDTO.html" data-type="entity-link" >UpdateEmailTemplateDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateFAQDto.html" data-type="entity-link" >UpdateFAQDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateHomePageTemplateDto.html" data-type="entity-link" >UpdateHomePageTemplateDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateMenuStatusDTO.html" data-type="entity-link" >UpdateMenuStatusDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdatePageDTO.html" data-type="entity-link" >UpdatePageDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdatePageInput.html" data-type="entity-link" >UpdatePageInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdatePageWithVersionInput.html" data-type="entity-link" >UpdatePageWithVersionInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdatePermissionDto.html" data-type="entity-link" >UpdatePermissionDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateRoleDto.html" data-type="entity-link" >UpdateRoleDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateRolePermissionDto.html" data-type="entity-link" >UpdateRolePermissionDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateRolesPermissionDto.html" data-type="entity-link" >UpdateRolesPermissionDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateSettingsDto.html" data-type="entity-link" >UpdateSettingsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateSubscriptionProductInput.html" data-type="entity-link" >UpdateSubscriptionProductInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateTestimonialDto.html" data-type="entity-link" >UpdateTestimonialDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/validateAuthOTPInput.html" data-type="entity-link" >validateAuthOTPInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/VerifyAuthOtpResponse.html" data-type="entity-link" >VerifyAuthOtpResponse</a>
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
                                    <a href="injectables/AdminService.html" data-type="entity-link" >AdminService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AdvancePageService.html" data-type="entity-link" >AdvancePageService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AppUserService.html" data-type="entity-link" >AppUserService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ClusterService.html" data-type="entity-link" >ClusterService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GqlAuthGuard.html" data-type="entity-link" >GqlAuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/HashService.html" data-type="entity-link" >HashService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtAuthGuard.html" data-type="entity-link" >JwtAuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtService.html" data-type="entity-link" >JwtService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MenuService.html" data-type="entity-link" >MenuService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/OtpService.html" data-type="entity-link" >OtpService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SettingService.html" data-type="entity-link" >SettingService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TaxonomyService.html" data-type="entity-link" >TaxonomyService</a>
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
                                <a href="guards/RoleGuard.html" data-type="entity-link" >RoleGuard</a>
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