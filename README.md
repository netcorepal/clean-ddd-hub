# Clean DDD Hub

Clean DDD Hub is a community platform for Domain-Driven Design (DDD) and Clean Architecture enthusiasts.

## Features

- **Knowledge Base**: Comprehensive documentation on DDD and Clean Architecture concepts
- **Frameworks**: Collection of DDD frameworks for .NET and Java
- **Community**: Connect with other developers and share knowledge

## Knowledge Base

The knowledge base is built with MkDocs and contains:

- Getting Started guides
- Core DDD concepts
- Architecture patterns
- Best practices
- Tool documentation

### Viewing the Knowledge Base

The knowledge base is automatically deployed to GitHub Pages:
**https://netcorepal.github.io/clean-ddd-hub/**

### Local Development of Documentation

To work on the documentation locally:

```bash
# Install Python dependencies
pip install -r requirements.txt

# Start the MkDocs development server
mkdocs serve

# Visit http://127.0.0.1:8000 in your browser
```

Documentation source files are located in the `docs/` directory.

## Project info

**URL**: https://lovable.dev/projects/3f61c7af-cb54-4685-836d-7dd4dc7b9839

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/3f61c7af-cb54-4685-836d-7dd4dc7b9839) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

### Frontend Application
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

### Documentation
- MkDocs
- Material for MkDocs theme
- Python

## How can I deploy this project?

### Frontend
Simply open [Lovable](https://lovable.dev/projects/3f61c7af-cb54-4685-836d-7dd4dc7b9839) and click on Share -> Publish.

### Documentation
Documentation is automatically deployed to GitHub Pages when changes are pushed to the `main` branch. The GitHub Actions workflow handles the build and deployment.

## Can I connect a custom domain to my Lovable project?

Yes it is!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Contributing

We welcome contributions! Please feel free to submit issues and pull requests.

### Contributing to Documentation

1. Fork the repository
2. Edit or add Markdown files in the `docs/` directory
3. Test locally with `mkdocs serve`
4. Submit a Pull Request

## License

See the LICENSE file for details.
