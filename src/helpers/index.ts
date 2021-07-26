/** @typedef {import("../../typings").ICommandStructure} ICommandStructure */
/** @typedef {import("../../typings").IEvent} IEvent */

import client from "..";
import botCache from "../cache";
import { ICommandStructure, IEvent } from "../interfaces";


/**
 * Create a new event.
 * @param {IEvent} event - Event structure.
 * @returns {void}
 */
export function createEvent(event: IEvent): void {
  if (event.type === "once") client.once(
    /**
     * @type {any[]} args
     * @returns {void | Promise<void>}
     */
    event.name, (...args: any[]): void | Promise<void> => event.execute(...args)
  );
  else client.on(
    /**
     * @type {any[]} args
     * @returns {void | Promise<void>}
     */
    event.name, (...args: any[]): void | Promise<void> => event.execute(...args)
  );
};


/**
 * Create a new command
 * @param {ICommandStructure} command - Command structure.
 * @returns {void}
 */
export function createCommand(command: ICommandStructure): void {
  botCache.commands.set(command.name, command);
};