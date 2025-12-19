package org.ergoplatform.explorer.http.api.v1.models

import org.ergoplatform.explorer.HexString
import sigmastate.lang.exceptions.SerializerException
import sigmastate.serialization.ErgoTreeSerializer.DefaultSerializer

object PrettyErgoTree {
  def fromString(s: String) : Either[PrettyErgoTreeError, ErgoTreeHuman] = {
    HexString.fromString[Either[Throwable, *]](s) match {
      case Left(_) => Left(PrettyErgoTreeError.BadEncoding)
      case Right(hexString) => fromHexString(hexString)
    }
  }

  def fromHexString(h: HexString): Either[PrettyErgoTreeError, ErgoTreeHuman] = {
    try {
      val ergoTree = DefaultSerializer.deserializeErgoTree(h.bytes)
      ergoTree.root match {
        case Left(_) => Left(PrettyErgoTreeError.UnparsedErgoTree)
        case Right(value) =>
          val script = value.toString
          val constants = ergoTree.constants.zipWithIndex.map { case (c, i) => s"$i: ${c.value}" }.mkString("\n")
          Right(ErgoTreeHuman(constants, script))
      }
    } catch {
      case se: SerializerException => Left(PrettyErgoTreeError.DeserializeException(se.message))
    }
  }
}

sealed trait PrettyErgoTreeError
object PrettyErgoTreeError {
  case object BadEncoding extends PrettyErgoTreeError
  case class DeserializeException(msg: String) extends PrettyErgoTreeError
  case object UnparsedErgoTree extends PrettyErgoTreeError
}