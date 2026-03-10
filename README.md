# Developer Portfolio

A minimal, performant, and fully responsive developer portfolio built with React and Vite. It features a clean design system, dynamic project cards, and a customizable Kanagawa-inspired dark-mode color palette.

## 🚀 Features

- **Component-Driven Architecture:** Clean segregation of sections (Hero, About, Projects, Contact).
- **Responsive Design:** Fluid layouts that work seamlessly across desktop, tablet, and mobile devices using CSS Grid and Flexbox.
- **Modern UI Elements:** Custom glassmorphism-style borders, text gradients, and interactive hover states.
- **FontAwesome Integration:** Scalable vector icons via FontAwesome 6 for visual elements.
- **Theming:** Centralized CSS variables for easy color scheme customization.

## 🛠️ Built With

- [React 19](https://react.dev/)
- [Vite](https://vitejs.dev/)
- Vanilla CSS
- [FontAwesome](https://fontawesome.com/)

## 📂 Project Structure

```text
src/
├── components/          # Reusable section components
│   ├── About.jsx        # About me & terminal window section
│   ├── Contact.jsx      # Links-driven contact section
│   ├── Hero.jsx         # Hero header & quick navigation sidebar
│   └── Projects.jsx     # Featured & linked works
├── App.jsx              # Main application orchestrator
├── App.css              # Global layout styles
├── index.css            # Base typography, vars, & root variables
└── main.jsx             # React entry point
```

## 💻 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18+ recommended)
- `npm` or `yarn`

### Installation & Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/portfoliosite.git
   cd PortfolioSite
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **View locally:**
   Open your browser and navigate to `http://localhost:5173`.

### Building for Production

To create an optimized production build:

```bash
npm run build
```

The output will be generated in the `dist` directory, ready to be statically deployed to hosts like Netlify, Vercel, or GitHub Pages.

## 🎨 Customization

### Updating Profile Data

To update the content with your own project metadata and bio, edit the corresponding files in `src/components/`:
- **`Hero.jsx`**: Update your name, roles, headline, and bio snippet.
- **`About.jsx`**: Modify your personal background text and terminal code JSON layout.
- **`Projects.jsx`**: Replace standalone items and linked project ecosystems (includes title, description, tags, FontAwesome class icon, & GitHub/Live links).
- **`Contact.jsx`**: Add/update your email, GitHub, LinkedIn, and Twitter links.

### Theming / Colors

You can safely modify the entire site's color scheme by adjusting the `--` variables inside `index.css`. The current aesthetic uses a Kanagawa-inspired palette.
