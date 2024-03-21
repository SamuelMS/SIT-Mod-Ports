import { injectable } from "tsyringe";

import { ContextVariable } from "@spt-aki/context/ContextVariable";
import { ContextVariableType } from "@spt-aki/context/ContextVariableType";
import { LinkedList } from "@spt-aki/utils/collections/lists/LinkedList";

@injectable()
export class ApplicationContext
{
    private variables = new Map<ContextVariableType, LinkedList<ContextVariable>>();
    private static holderMaxSize = 10;

    /**
     * Called like:
     * ```
     * const registerPlayerInfo = this.applicationContext.getLatestValue(ContextVariableType.REGISTER_PLAYER_REQUEST).getValue<IRegisterPlayerRequestData>();
     *
     * const activePlayerSessionId = this.applicationContext.getLatestValue(ContextVariableType.SESSION_ID).getValue<string>();
     *
     * const matchInfo = this.applicationContext.getLatestValue(ContextVariableType.RAID_CONFIGURATION).getValue<IGetRaidConfigurationRequestData>();
     * ```
     */
    public getLatestValue(type: ContextVariableType): ContextVariable
    {
        if (this.variables.has(type))
        {
            return this.variables.get(type)?.getTail();
        }
    }

    public getValues(type: ContextVariableType): ContextVariable[]
    {
        if (this.variables.has(type))
        {
            const res: ContextVariable[] = [];

            for (const value of this.variables.get(type).values())
            {
                res.push(value);
            }

            return res;
        }
    }

    public addValue(type: ContextVariableType, value: any): void
    {
        let list: LinkedList<ContextVariable>;
        if (this.variables.has(type))
        {
            list = this.variables.get(type);
        }
        else
        {
            list = new LinkedList<ContextVariable>();
        }

        if (list.length >= ApplicationContext.holderMaxSize)
        {
            list.shift();
        }

        list.append(new ContextVariable(value, type));
        this.variables.set(type, list);
    }

    public clearValues(type: ContextVariableType): void
    {
        if (this.variables.has(type))
        {
            this.variables.delete(type);
        }
    }
}
