import { html, css, LitElement } from 'lit';

export class ApiComponent extends LitElement {
  static styles = css`
    :host {
      background-color: rgba(189, 183, 183, 1);
      border-radius: 25px;
      left: 10%;
      min-height: 30rem;
      padding: 2rem;
      position: absolute;
      right: 10%;
      width: 40%;
    }

    h2 {
      margin: 0;
      text-align: center;
    }

    .header {
      align-items: center;
      display: flex;
      justify-content: space-between;
    }

    .header-fetchButton {
      background-color: green;
      border: 2px solid green;
      border-radius: 5px;
      color: white;
      cursor: pointer;
      height: 2rem;
      padding: 0 1rem 0 1rem;
      transition-duration: 0.4s;
    }

    .header-fetchButton:hover {
      color: black;
    }

    .loading {
      height: 40vh
      margin-top: 2rem;
      text-align: center;
    }

    .list {
      display: flex;
      margin-bottom: 2rem;
      min-height: 20vh;
    }

    .list-details {
      width: 50%;
    }

    .list-details__ingredients {
      margin-left: 5rem;
    }

    img {
      border-radius: 5px;
      box-shadow: 5px 5px 3px 1px rgba(0, 0, 0, 0.5);
      height: 12rem;
      width: 12rem;
    }

    .instructions {
      display: flex;
      justify-content: space-around;
      text-align: center;
    }

    .instructions-textarea {
      border: 1px solid black;
      border-radius: 5px;
      max-width: 70%;
      padding: 1rem;
      width: 70%;
      text-align: left;
    }
  `;

  static properties = {
    _cocktail: { type: Object },
    _error: { type: String },
    _hasError: { type: Boolean },
    _ingredients: { type: Array },
    _isLoading: { type: Boolean },
  };

  constructor() {
    super();

    this._cocktail = {};
    this._hasError = false;
    this._error = {
      name: '500',
      message: 'server error',
    };
    this._ingredients = [];
  }

  connectedCallback() {
    super.connectedCallback();
    this._getRandomCocktail();
  }

  async _getRandomCocktail() {
    this._isLoading = true;

    try {
      const url = 'https://www.thecocktaildb.com/api/json/v1/1/random.php';
      const response = await fetch(url);
      const data = await response.json();
      const dataArr = data.drinks[0];

      this._cocktail = dataArr;
      this._ingredients = [];

      Object.keys(this._cocktail).forEach(key => {
        if (
          key.includes('strIngredient') &&
          this._cocktail[key] !== null &&
          this._cocktail[key].length !== 0
        ) {
          this._ingredients.push(this._cocktail[key]);
        }
      });
    } catch (error) {
      this._hasError = true;
      this._error = error;
    } finally {
      setTimeout(() => {
        this._isLoading = false;
      }, 300); // Note: redundant timeout to wait 300ms, just to show loading effect
    }
  }

  render() {
    const cocktail = this._cocktail;

    const ingredients = html`<ul>
      ${this._ingredients.map(el => html`<li>${el}</li>`)}
    </ul>`;

    let drinkName = this._isLoading ? '...' : html`${cocktail.strDrink}`;
    let mainSection;

    if (this._isLoading)
      mainSection = html`<p class="loading">Loading.....</p>`;
    else {
      mainSection = html`
        <div>
          <section class="list">
            <div class="list-details">
              <div>List of ingredients:</div>

              <div class="list-details__ingredients">${ingredients}</div>
            </div>

            <div class="list-details__ingredients">
              <img src="${cocktail.strDrinkThumb}" alt="cocktail_img" />
            </div>
          </section>

          <section class="instructions">
            <h5>Recipe</h5>

            <div class="instructions-textarea">${cocktail.strInstructions}</div>
          </section>
        </div>
      `;
    }

    return html`
      <h2>Cocktail database</h2>

      <section class="header">
        <h4>${drinkName}</h4>

        <button class="header-fetchButton" @click=${this._getRandomCocktail}>
          show new cocktail
        </button>
      </section>

      <p>${mainSection}</p>
    `;
  }
}
