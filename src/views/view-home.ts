import '@polymer/paper-button/paper-button';
import '@polymer/paper-input/paper-input';
import '@polymer/polymer/lib/elements/custom-style';
import { connect } from 'fit-html';
import { html } from 'lit-html';

import { triggerOAuthLogin } from '../actions/auth';
import { createPartyStart, joinPartyStart as joinParty } from '../actions/party-data';
import { changePartyId } from '../actions/view-home';
import admins from "../admins";
import { State } from '../state';
import sharedStyles from '../util/shared-styles';

interface HomeViewProps {
    authorizationInProgress: boolean;
    authorizedAndPremium: boolean;
    authStatusKnown: boolean;
    partyCreationInProgress: boolean;
    partyCreationError: Error | null;
    partyId: string;
    partyIdValid: boolean;
    partyJoinError: Error | null;
    partyJoinInProgress: boolean;
    playerCompatible: boolean;
}
interface HomeViewDispatch {
    changePartyId: (partyId: string) => void;
    createParty: () => void;
    joinParty: () => void;
    loginWithSpotify: () => void;
}

const LowerButton = (props: HomeViewProps & HomeViewDispatch) => {
    if (props.partyCreationInProgress) {
        return html`
            <paper-button raised disabled>
                Creating...
            </paper-button>
        `;
    } else if (props.authorizedAndPremium) {
        return html`
            <paper-button raised @click=${props.createParty}>
                Create Party
            </paper-button>
        `;
    } else if (props.authorizationInProgress || !props.authStatusKnown) {
        return html`
            <paper-button raised disabled class='clear'>
                Authorizing...
            </paper-button>
        `;
    } else {
        return html`
            <paper-button class='clear' @click=${props.loginWithSpotify}>
                <iron-icon icon='festify:verified-user'></iron-icon>
                &nbsp;Admin-Login
            </paper-button>
        `;
    }
};

/* tslint:disable:max-line-length */
const HomeView = (props: HomeViewProps & HomeViewDispatch) => html`
    ${sharedStyles}
    <style>
        :host {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100%;
            padding: 0 10px;
            text-align: center;

            background: linear-gradient(rgba(28, 31, 36, 0.9), rgba(28, 31, 36, 0.9));
            background-size: cover;

            --paper-input-container-input: {
                font-size: 24px;
            }

            --paper-input-container-label: {
                font-size: 20px;
            }
        }

        paper-button[disabled] {
            opacity: 0.8;
        }

        svg {
            height: 180px;
            width: 180px;
        }

        p {
            padding: 0 25px;
            max-width: 500px;
            font-size: 20px;
        }

        main {
            display: flex;
            flex-flow: column nowrap;

            margin: 0 auto;
            min-width: 250px;
        }

        #middle {
            margin: 8px 0 16px 0;
        }
    </style>

    <p>Please enter the Party Code to join and add or vote for songs.</p>

    <main>
        <paper-input
            label="Party Code"
            type="tel"
            @input=${ev => props.changePartyId((ev.target as HTMLInputElement).value)}
            on-keypress="${(ev: KeyboardEvent) => {
                if (props.partyIdValid && ev.key === 'Enter') {
                    props.joinParty();
                }
            }}"
            value="${props.partyId}"
        >
        </paper-input>

        <paper-button id="middle" raised .disabled=${!props.partyIdValid} @click=${props.joinParty}>
            ${props.partyJoinInProgress ? 'Joining...' : 'Join Party'}
        </paper-button>

        ${props.playerCompatible ? LowerButton(props) : null}

        <paper-button id="middle" class="clear" @click=${() => {window.location.href = "https://github.com/kimar/jukebox-app"; }}>
            <iron-icon icon="social:github"></iron-icon>
            &nbsp;Sourcecode
        </paper-button>
    </main>
`;
/* tslint:enable */

const mapStateToProps = (state: State): HomeViewProps => ({
    ...state.homeView,
    authorizationInProgress: state.user.credentials.spotify.authorizing,
    authorizedAndPremium: Boolean(
        state.user.credentials.spotify.user &&
            state.user.credentials.spotify.user.product === 'premium' &&
            admins.indexOf(state.user.credentials.spotify.user.email) >= 0,
    ),
    authStatusKnown: state.user.credentials.spotify.statusKnown,
    playerCompatible: state.player.isCompatible,
});

const mapDispatchToProps: HomeViewDispatch = {
    changePartyId,
    createParty: createPartyStart,
    joinParty,
    loginWithSpotify: () => triggerOAuthLogin('spotify'),
};

customElements.define('view-home', connect(mapStateToProps, mapDispatchToProps)(HomeView));
