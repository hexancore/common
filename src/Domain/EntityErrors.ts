import { AppErrorCode, ERR, ERRA, HObjectTypeMeta, type AR, type HObjectTypeMetaAware, type R } from "../Util";

export interface EntityErrorData {
  typeId: string;
}

export interface NotFoundEntityErrorData extends EntityErrorData {
}

export class EntityError {
  public constructor(public readonly type: string, public readonly code: number) {

  }

  public err<T>(entityMeta: HObjectTypeMeta | HObjectTypeMetaAware<any>, data: Record<string, any> = {}): R<T> {
    return ERR(this.type, this.code, {
      typeId: entityMeta["HOBJ_META"] ? entityMeta["HOBJ_META"].typeId : entityMeta["typeId"],
      ...data
    });
  }

  public erra<T>(entityMeta: HObjectTypeMeta | HObjectTypeMetaAware<any>, data: Record<string, any> = {}): AR<T> {
    return ERRA(this.type, this.code, {
      typeId: entityMeta["HOBJ_META"] ? entityMeta["HOBJ_META"].typeId : entityMeta["typeId"],
      ...data
    });
  }

  public matches(result: R<any>): boolean {
    return result.isError() && result.e.type === this.type;
  }
}

export const EntityErrorTypes = {
  notFound: "core.domain.entity.not_found",
  duplicate: "core.domain.entity.duplicate",
  optimisticLock: "core.domain.entity.optimistic_lock",
};

export const EntityErrors = {
  notFound: new EntityError(EntityErrorTypes.notFound, AppErrorCode.NOT_FOUND),
  duplicate: new EntityError(EntityErrorTypes.notFound, AppErrorCode.CONFLICT),
  optimisticLock: new EntityError(EntityErrorTypes.optimisticLock, AppErrorCode.CONFLICT),

  extractErrorEntityTypeId(result: R<any>): string | undefined {
    return result.isError() ? result.e.data?.typeId : undefined;
  }
};