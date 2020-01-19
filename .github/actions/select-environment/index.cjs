const fs = require('fs')
const path = require('path')
const core = require('@actions/core')
const tc = require('@actions/tool-cache')
const github = require('@actions/github');

const TERRAFORM_VERSION = '0.12.19'
const main = async () => {
  try {
    const context = github.context;
    const shortSha = context.sha.substr(0,8)
    const gaeProject = process.env.GAE_PROJECT;
    const gaeService = process.env.GAE_SERVICE;
    const environments = {
      review: {
        ref: false,
        name: process.env.REVIEW_ENVIRONMENT,
        transient: true,
        production: false,
        gaeVersion: `pr-${context.payload.number}`,
        extraFlags: '',
        auto_inactive: false,
      },
      dev: {
        ref: process.env.DEV_REF,
        name: process.env.DEVELOPMENT_ENVIRONMENT,
        transient: false,
        production: false,
        gaeVersion:`${process.env.DEVELOPMENT_ENVIRONMENT}-${shortSha}`,
        extraFlags: '',
        auto_inactive: true,
      },
      staging: {
        ref: process.env.STAGING_REF,
        name: process.env.STAGING_ENVIRONMENT,
        transient: false,
        production: false,
        gaeVersion:`${process.env.STAGING_ENVIRONMENT}-${shortSha}`,
        extraFlags: '',
        auto_inactive: true,
      },
      production: {
        ref: process.env.PRODUCTION_REF,
        name: process.env.PRODUCTION_ENVIRONMENT,
        transient: false,
        production: true,
        gaeVersion: `${process.env.PRODUCTION_ENVIRONMENT}-${shortSha}`,
        extraFlags: '--promote',
        auto_inactive: true,
      },
    };

    const getFlags = env =>  `--no-stop-previous-version --version=${env.gaeVersion} --project=${gaeProject} -q ${env.extraFlags || ''}`;
    let environment = environments.review;
    let sourceRef = context.ref;
    let isPush = false

    if (context.eventName === 'pull_request') {
      sourceRef = context.payload.pull_request.head.ref
    }
    if (context.eventName === 'push') {
      isPush = true
    }

    // determine what environment we're acting on.
    if (isPush && sourceRef.indexOf(process.env.DEV_REF) > 1) {
      environment = environments.dev;
      core.debug("Dev environment selected", environment)
    } else if (isPush && sourceRef.indexOf(process.env.STAGING_REF) > 1) {
      environment = environments.staging;
      core.debug("Staging environment selected", environment)
    } else if (isPush && sourceRef.indexOf(process.env.PRODUCTION_REF) > 1) {
      environment = environments.production;
      core.debug("Production environment selected", environment)
    } else {
      core.debug("Review environment selected", environment)
    }

    const flags = getFlags(environment)
    const url = `https://${environment.gaeVersion}-dot-${gaeService}-dot-${gaeProject}.appspot.com`

    const current_environment = environment.name;
    const rawEnvVars = process.env[`env_${current_environment}`];
    core.info(`Setting env vars for env ${environment.name} from secret env_${current_environment}`, rawEnvVars)
    const env_vars =  JSON.parse(rawEnvVars);
    let secretyaml = "env_variables:\n"
    for (let [k,v] of Object.entries(env_vars)) {
      secretyaml += `  ${k}: '${v}'\n`
    }
    secretyaml += `  BUILD_SHA: '${context.sha}'\n`
    secretyaml += `  BUILD_REF: '${sourceRef}'\n`
    // write the secrets to secret.yaml
    const secretPath = path.join(process.cwd(), 'secret.yaml')
    fs.writeFileSync(secretPath, secretyaml)

    const tf_vars = JSON.parse(process.env.TF_VARS)
    core.debug(`Writing TF secrets to varfile from TF_VARS secret`,tf_vars)
    let tf_var_file= ''
    for (let [k,v] of Object.entries(tf_vars)) {
      tf_var_file += `${k} = "${v.replace(/\"/g,"\\\"")}"\n`
      core.info(`Setting ${k} to ${v}`)
      core.exportVariable(`TF_VAR_${k}`, v);
    }
    const tfSecretPath = path.join(process.cwd(), 'terraform', 'terraform.tfvars')
    fs.writeFileSync(tfSecretPath, tf_var_file)
    core.info(`Wrote TF vars to ${tfSecretPath}`)

    const credentialsPath = core.getInput('google-credentials') || 'credentials.json';
    const credentialsIsB64Encoded = core.getInput('google-credentials-encoded') || true;
    const decodedPath = path.join(process.cwd(), 'terraform','credentials-decoded.json')
    // is credentials a file?
    let encodedCredentials
    let decodedCredentials
    try {
      encodedCredentials = fs.readFileSync(credentialsPath)
      core.info(`Read gcloud credentials from file`, credentialsPath)
    } catch (err) {
      encodedCredentials = credentialsPath
    }

    // core.info(`Setting GOOGLE_CREDENTIALS`)

    if (credentialsIsB64Encoded) {
      const buff = Buffer.from(encodedCredentials, 'base64')
      decodedCredentials = buff.toString('ascii')
      fs.writeFileSync(decodedPath, decodedCredentials)
      core.info(`Wrote decoded credentials to ${decodedPath}`)
    }
    core.exportVariable('GOOGLE_CREDENTIALS', decodedCredentials)
    core.info(`Setting GOOGLE_APPLICATION_CREDENTIALS as ${decodedPath}`)
    core.exportVariable('GOOGLE_APPLICATION_CREDENTIALS', decodedPath)
    core.exportVariable('GOOGLE_BACKEND_CREDENTIALS', decodedPath )


    // setup terraform
    const tf = await tc.downloadTool(`https://releases.hashicorp.com/terraform/${TERRAFORM_VERSION}/terraform_${TERRAFORM_VERSION}_linux_amd64.zip`)
    const tfExtracted = await tc.extractZip(tf, '~/.tools/terraform');

    const cachedTf = await tc.cacheDir(tfExtracted, 'terraform', TERRAFORM_VERSION);
    core.addPath(cachedTf);

    core.exportVariable('TARGET_ENV', JSON.stringify(environment));
    core.exportVariable('ENV_URL', url);
    core.exportVariable('DEPLOY_FLAGS', flags);
    core.setOutput('target', JSON.stringify(environment));
    core.setOutput('url', url);
    core.setOutput('flags', flags);

  } catch (error) {
    core.setFailed(error.message);
  }
}
main()