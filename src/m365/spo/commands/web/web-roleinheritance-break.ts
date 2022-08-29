import { Logger } from '../../../../cli';
import GlobalOptions from '../../../../GlobalOptions';
import SpoCommand from '../../../base/SpoCommand';
import commands from '../../commands';
import request from '../../../../request';
import { validation } from '../../../../utils';

interface CommandArgs {
  options: Options;
}

interface Options extends GlobalOptions {
  webUrl: string;
}

class SpoWebRoleInheritanceBreakCommand extends SpoCommand {
  public get name(): string {
    return commands.WEB_ROLEINHERITANCE_BREAK;
  }

  public get description(): string {
    return 'Break role inheritance of subsite';
  }

  constructor() {
    super();

    this.#initOptions();
    this.#initValidators();
  }

  #initOptions(): void {
    this.options.unshift(
      {
        option: '-u, --webUrl <webUrl>'
      }
    );
  }

  #initValidators(): void {
    this.validators.push(
      async (args: CommandArgs) => {
        return validation.isValidSharePointUrl(args.options.webUrl);
      }
    );
  }

  public commandAction(logger: Logger, args: CommandArgs, cb: () => void): void {
    if (this.verbose) {
      logger.logToStderr(`Break role inheritance of subsite at ${args.options.webUrl}...`);
    }
    logger.log('peter1');

    const requestOptions: any = {
      url: `${args.options.webUrl}/_api/web/breakroleinheritance`,
      method: 'POST',
      headers: {
        'accept': 'application/json;odata=nometadata',
        'content-type': 'application/json'
      },
      responseType: 'json'
    };

    request
      .post(requestOptions)
      .then(_ => cb(), (err: any): void => this.handleRejectedODataJsonPromise(err, logger, cb));
  }
}

module.exports = new SpoWebRoleInheritanceBreakCommand();
