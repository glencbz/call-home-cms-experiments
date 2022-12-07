# Notes on Strapi deployment

## Deploying GCP infrastructure with Terraform

### Setting up

Ensure that `terraform` and `gcloud` are installed.

Set your desired database username and password in `secret.tfvars`.

If you already have a remote terraform state on GCS ready for use (as defined in `backend.tf`),
simply run `terraform init` to set up terraform.
Otherwise, set up terraform from scratch as follows:
1. Comment out `backend.tf`
2. Run `terraform init`: this initially sets up terraform with a local state
3. Run `npm run terraform-deploy-init`: this will deploy a GCS bucket to hold your remote terraform state
4. Uncomment `backend.tf` and replace `bucket` with the name of the created GCS bucket
5. Run `terraform init` again and enter "yes" when prompted to copy pre-existing state: this will set up terraform to switch to a remote state
   - If it fails with an error saying that the bucket does not exist, run `gcloud auth application-default login`
6. (Optional) Delete your local copies of `terraform.tfstate` and `terraform.tfstate.backup`

### Deployment

Run `npm run terraform-deploy` to deploy the GCP resources for Strapi using terraform.
This may take about 20 minutes.

## Deploying to App Engine

Ensure that `gcloud` is installed and that you are authenticated via `gcloud auth login`.
Ensure that your Cloud Build service account has the appropriate IAM permissions for deployment by following
[this section](https://cloud.google.com/build/docs/deploying-builds/deploy-appengine#grant-permissions) of the App Engine deployment guide.

Copy `app.template.yaml` to `app.yaml` and replace the database username, password, and instance identifiers appropriately.

To deploy Strapi to App Engine, run `npm run app-deploy`.

## Collections

To create or update collections on Strapi, run Strapi locally using `npm run develop` and change the collections using the admin console.
Commit and push the local changes with `git`, then re-deploy the latest changes to App Engine.

# 🚀 Getting started with Strapi

Strapi comes with a full featured [Command Line Interface](https://docs.strapi.io/developer-docs/latest/developer-resources/cli/CLI.html) (CLI) which lets you scaffold and manage your project in seconds.

### `develop`

Start your Strapi application with autoReload enabled. [Learn more](https://docs.strapi.io/developer-docs/latest/developer-resources/cli/CLI.html#strapi-develop)

```
npm run develop
# or
yarn develop
```

### `start`

Start your Strapi application with autoReload disabled. [Learn more](https://docs.strapi.io/developer-docs/latest/developer-resources/cli/CLI.html#strapi-start)

```
npm run start
# or
yarn start
```

### `build`

Build your admin panel. [Learn more](https://docs.strapi.io/developer-docs/latest/developer-resources/cli/CLI.html#strapi-build)

```
npm run build
# or
yarn build
```

## ⚙️ Deployment

Strapi gives you many possible deployment options for your project. Find the one that suits you on the [deployment section of the documentation](https://docs.strapi.io/developer-docs/latest/setup-deployment-guides/deployment.html).

## 📚 Learn more

- [Resource center](https://strapi.io/resource-center) - Strapi resource center.
- [Strapi documentation](https://docs.strapi.io) - Official Strapi documentation.
- [Strapi tutorials](https://strapi.io/tutorials) - List of tutorials made by the core team and the community.
- [Strapi blog](https://docs.strapi.io) - Official Strapi blog containing articles made by the Strapi team and the community.
- [Changelog](https://strapi.io/changelog) - Find out about the Strapi product updates, new features and general improvements.

Feel free to check out the [Strapi GitHub repository](https://github.com/strapi/strapi). Your feedback and contributions are welcome!

## ✨ Community

- [Discord](https://discord.strapi.io) - Come chat with the Strapi community including the core team.
- [Forum](https://forum.strapi.io/) - Place to discuss, ask questions and find answers, show your Strapi project and get feedback or just talk with other Community members.
- [Awesome Strapi](https://github.com/strapi/awesome-strapi) - A curated list of awesome things related to Strapi.

---

<sub>🤫 Psst! [Strapi is hiring](https://strapi.io/careers).</sub>
