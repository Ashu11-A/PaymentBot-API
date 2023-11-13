import { SetMetadata } from '@nestjs/common'

export const IS_PUBLIC_KEY= 'isPublic'
export const Public = (enable?: boolean) => SetMetadata(IS_PUBLIC_KEY, enable ?? true)
